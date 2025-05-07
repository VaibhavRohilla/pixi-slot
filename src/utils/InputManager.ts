import { EventEmitter } from 'events';
import { Point } from 'pixi.js';

export interface TouchData {
    id: number;
    position: Point;
    startPosition: Point;
    delta: Point;
}

export interface InputState {
    keys: { [key: string]: boolean };
    mousePosition: Point;
    mouseButtons: { [button: number]: boolean };
    touches: Map<number, TouchData>;
    isPointerDown: boolean;
}

export class InputManager extends EventEmitter {
    private static instance: InputManager;
    private state: InputState;
    private canvas: HTMLCanvasElement;
    private touchStartTime: number = 0;
    private touchStartPosition: Point = new Point();
    private readonly DOUBLE_TAP_DELAY: number = 300;
    private readonly SWIPE_THRESHOLD: number = 50;

    private constructor() {
        super();
        this.state = {
            keys: {},
            mousePosition: new Point(),
            mouseButtons: {},
            touches: new Map(),
            isPointerDown: false
        };
        this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
        this.initialize();
    }

    public static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    private initialize(): void {
        // Keyboard events
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));

        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchcancel', this.handleTouchCancel.bind(this));

        // Prevent default touch behavior
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.state.keys[event.code] = true;
        this.emit('keydown', event.code);
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.state.keys[event.code] = false;
        this.emit('keyup', event.code);
    }

    private handleMouseDown(event: MouseEvent): void {
        this.state.mouseButtons[event.button] = true;
        this.state.isPointerDown = true;
        this.updateMousePosition(event);
        this.emit('pointerdown', this.state.mousePosition);
    }

    private handleMouseUp(event: MouseEvent): void {
        this.state.mouseButtons[event.button] = false;
        this.state.isPointerDown = false;
        this.updateMousePosition(event);
        this.emit('pointerup', this.state.mousePosition);
    }

    private handleMouseMove(event: MouseEvent): void {
        this.updateMousePosition(event);
        this.emit('pointermove', this.state.mousePosition);
    }

    private handleMouseLeave(): void {
        this.state.isPointerDown = false;
        Object.keys(this.state.mouseButtons).forEach(key => {
            this.state.mouseButtons[Number(key)] = false;
        });
        this.emit('pointerleave');
    }

    private handleTouchStart(event: TouchEvent): void {
        this.state.isPointerDown = true;
        const now = Date.now();
        
        Array.from(event.changedTouches).forEach(touch => {
            const position = this.getTouchPosition(touch);
            const touchData: TouchData = {
                id: touch.identifier,
                position: position,
                startPosition: position.clone(),
                delta: new Point()
            };
            this.state.touches.set(touch.identifier, touchData);

            // Check for double tap
            if (now - this.touchStartTime < this.DOUBLE_TAP_DELAY) {
                this.emit('doubletap', position);
            }
            this.touchStartTime = now;
            this.touchStartPosition = position.clone();

            this.emit('pointerdown', position);
        });
    }

    private handleTouchEnd(event: TouchEvent): void {
        Array.from(event.changedTouches).forEach(touch => {
            const touchData = this.state.touches.get(touch.identifier);
            if (touchData) {
                const position = this.getTouchPosition(touch);
                const delta = new Point(
                    position.x - touchData.startPosition.x,
                    position.y - touchData.startPosition.y
                );

                // Check for swipe
                if (Math.abs(delta.x) > this.SWIPE_THRESHOLD || 
                    Math.abs(delta.y) > this.SWIPE_THRESHOLD) {
                    this.emit('swipe', {
                        direction: this.getSwipeDirection(delta),
                        delta: delta
                    });
                }

                this.state.touches.delete(touch.identifier);
                this.emit('pointerup', position);
            }
        });

        if (this.state.touches.size === 0) {
            this.state.isPointerDown = false;
        }
    }

    private handleTouchMove(event: TouchEvent): void {
        Array.from(event.changedTouches).forEach(touch => {
            const touchData = this.state.touches.get(touch.identifier);
            if (touchData) {
                const position = this.getTouchPosition(touch);
                touchData.position = position;
                touchData.delta = new Point(
                    position.x - touchData.startPosition.x,
                    position.y - touchData.startPosition.y
                );
                this.emit('pointermove', position);
            }
        });
    }

    private handleTouchCancel(event: TouchEvent): void {
        Array.from(event.changedTouches).forEach(touch => {
            this.state.touches.delete(touch.identifier);
        });
        if (this.state.touches.size === 0) {
            this.state.isPointerDown = false;
        }
    }

    private updateMousePosition(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this.state.mousePosition.set(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    }

    private getTouchPosition(touch: Touch): Point {
        const rect = this.canvas.getBoundingClientRect();
        return new Point(
            touch.clientX - rect.left,
            touch.clientY - rect.top
        );
    }

    private getSwipeDirection(delta: Point): string {
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            return delta.x > 0 ? 'right' : 'left';
        } else {
            return delta.y > 0 ? 'down' : 'up';
        }
    }

    public isKeyDown(code: string): boolean {
        return this.state.keys[code] || false;
    }

    public isMouseButtonDown(button: number): boolean {
        return this.state.mouseButtons[button] || false;
    }

    public getMousePosition(): Point {
        return this.state.mousePosition.clone();
    }

    public getTouchData(id: number): TouchData | undefined {
        return this.state.touches.get(id);
    }

    public getAllTouches(): TouchData[] {
        return Array.from(this.state.touches.values());
    }

    public isPointerDown(): boolean {
        return this.state.isPointerDown;
    }

    public destroy(): void {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        window.removeEventListener('keyup', this.handleKeyUp.bind(this));
        this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    }
} 