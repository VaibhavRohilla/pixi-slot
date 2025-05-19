import { EventManager, GameEvent, IGambleChoice, IGambleResult } from '../core/utils/EventManager';
import { gambleMaxRounds, gambleMaxWinMultiplier } from '../slotcore/gameConfig'; // Import gamble configs

export class GambleController {
    private static instance: GambleController;

    private currentWinAmount: number = 0;
    private gambleAmount: number = 0;
    private eventManager: EventManager;
    private initialGambleStake: number = 0; // The very first amount brought into the gamble sequence
    private currentGambleRound: number = 0;

    private constructor() {
        this.eventManager = EventManager.getInstance();
        console.log('GambleController Initialized');
    }

    public static getInstance(): GambleController {
        if (!GambleController.instance) {
            GambleController.instance = new GambleController();
        }
        return GambleController.instance;
    }

    public startGamble(winAmount: number): void {
        this.currentWinAmount = winAmount;
        this.gambleAmount = winAmount; // Amount being risked in the current gamble choice
        this.initialGambleStake = winAmount; // Store the initial stake for max win calculation
        this.currentGambleRound = 0; // Reset round counter

        console.log(`GambleController: Started gamble. Initial Stake: ${this.initialGambleStake}, Risking: ${this.gambleAmount}`);
        // TODO: Show Gamble UI - this will be handled by a dedicated PixiGambleUI class later
        // For now, we can emit an event that the UI layer would listen to.
        this.eventManager.emit(GameEvent.GAMBLE_UI_SHOW as any, { 
            gambleAmount: this.gambleAmount,
            currentWin: this.currentWinAmount 
        });
    }

    public makeChoice(choice: IGambleChoice): void {
        if (choice.type === 'color') {
            const winningColor = Math.random() < 0.5 ? 'red' : 'black';
            let isWin = choice.value === winningColor;

            console.log(`GambleController: Player chose ${choice.value}, winning color was ${winningColor}. Win: ${isWin}`);

            if (isWin) {
                this.currentWinAmount = this.gambleAmount * 2;
                this.currentGambleRound++;

                let canGambleAgain = true;
                if (this.currentGambleRound >= gambleMaxRounds) {
                    canGambleAgain = false;
                    console.log(`GambleController: Max rounds (${gambleMaxRounds}) reached.`);
                }
                // Ensure initialGambleStake is not 0 to prevent division by zero or incorrect large multiplier if win started at 0
                if (this.initialGambleStake > 0 && this.currentWinAmount >= this.initialGambleStake * gambleMaxWinMultiplier) {
                    canGambleAgain = false;
                    console.log(`GambleController: Max win multiplier (${gambleMaxWinMultiplier}x of initial stake ${this.initialGambleStake}) reached.`);
                }

                this.eventManager.emit(GameEvent.GAMBLE_WON as any, { 
                    isWin: true, 
                    newWinAmount: this.currentWinAmount,
                    canGambleAgain,
                    winningOutcome: winningColor // Include winning outcome
                } as IGambleResult);

                if (canGambleAgain) {
                    this.gambleAmount = this.currentWinAmount; 
                } else {
                    this.endGamble(false); // Auto-collect if cannot gamble further
                }
            } else {
                this.currentWinAmount = 0;
                this.eventManager.emit(GameEvent.GAMBLE_LOST as any, { 
                    isWin: false, 
                    newWinAmount: 0,
                    winningOutcome: winningColor // Include winning outcome
                } as IGambleResult);
                this.endGamble(false); // Lost, so gamble automatically ends
            }
        }
    }

    /**
     * Called when player chooses to collect, or gamble is lost, or max rounds reached.
     * @param playerCollected True if the player explicitly chose to collect winnings.
     */
    public endGamble(playerCollected: boolean): void {
        console.log(`GambleController: Ending gamble. Player collected: ${playerCollected}, Final win amount: ${this.currentWinAmount}, Rounds: ${this.currentGambleRound}`);
        this.eventManager.emit(GameEvent.GAMBLE_ENDED as any, { 
            finalWinAmount: this.currentWinAmount, 
            collected: playerCollected 
        });
        this.gambleAmount = 0;
        this.initialGambleStake = 0;
        this.currentGambleRound = 0;
        // TODO: Hide Gamble UI - this will be handled by a dedicated PixiGambleUI class later
        this.eventManager.emit(GameEvent.GAMBLE_UI_HIDE as any);
    }

    public getCurrentGambleAmount(): number {
        return this.gambleAmount;
    }

    public getCurrentTotalWin(): number {
        return this.currentWinAmount;
    }

    // Override activate and deactivate from BaseGameFeaturesController if needed for specific setup/teardown
    public activate(): void {
        // super.activate();
        // Specific activation logic for gamble, e.g., subscribing to UI events if GambleController manages its own UI inputs
        console.log('GambleController Activated');
    }

    public deactivate(): void {
        // super.deactivate();
        // Specific deactivation logic
        if (this.gambleAmount > 0 && this.currentWinAmount > 0) {
            // If gamble is deactivated unexpectedly (e.g. error, forced exit) while a gamble was in progress
            // Ensure GAMBLE_ENDED is emitted to return funds to player, or handle as per game rules (e.g. void gamble)
            console.warn('GambleController deactivated mid-gamble. Auto-collecting.');
            this.endGamble(true); 
        }
        console.log('GambleController Deactivated');
    }
} 