import * as fs from 'fs';
import * as path from 'path';

interface Asset {
    alias: string;
    src: string;
    data?: string;
}

interface Bundle {
    name: string;
    assets: Asset[];
}

interface Manifest {
    bundles: Bundle[];
}

function generateAlias(filePath: string, bundleName: string): string {
    const fileName = path.basename(filePath, path.extname(filePath));
    return `${bundleName}-${fileName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function isSpriteSheet(filePath: string): boolean {
    const fileName = path.basename(filePath, path.extname(filePath));
    const jsonPath = path.join('src/assets/data', `${fileName}.json`);
    const fntPath = path.join('src/assets/data', `${fileName}.fnt`);
    return fs.existsSync(jsonPath) || fs.existsSync(fntPath);
}

function getDataPath(filePath: string): string {
    const fileName = path.basename(filePath, path.extname(filePath));
    const jsonPath = path.join('src/assets/data', `${fileName}.json`);
    const fntPath = path.join('src/assets/data', `${fileName}.fnt`);
    
    if (fs.existsSync(jsonPath)) {
        return jsonPath;
    } else if (fs.existsSync(fntPath)) {
        return fntPath;
    }
    return '';
}

function scanDirectory(dirPath: string, bundleName: string): Asset[] {
    const assets: Asset[] = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively scan subdirectories
            const subDirAssets = scanDirectory(fullPath, bundleName);
            assets.push(...subDirAssets);
        } else if (stat.isFile() && (
            /\.(png|jpg|jpeg)$/i.test(file) || // Image files
            (bundleName === 'audio' && /\.(mp3|ogg)$/i.test(file)) // Audio files for audio bundle
        )) {
            // Use forward slashes and ensure path starts with /assets
            const relativePath = path.relative('src', fullPath).replace(/\\/g, '/');
            const asset: Asset = {
                alias: generateAlias(fullPath, bundleName),
                src: `/${relativePath}`
            };

            // Check if it's a sprite sheet (only for image files)
            if (isSpriteSheet(fullPath)) {
                const dataPath = getDataPath(fullPath);
                if (dataPath) {
                    const dataRelativePath = path.relative('src', dataPath).replace(/\\/g, '/');
                    asset.data = `/${dataRelativePath}`;
                }
            }

            assets.push(asset);
        }
    }

    return assets;
}

function generateManifest(): Manifest {
    const manifest: Manifest = {
        bundles: []
    };

    // Define bundle directories
    const bundleDirs = {
        'game': 'src/assets/images/game',
        'winlines': 'src/assets/images/winlines',
        'symbols': 'src/assets/images/symbols',
        'freeSpinsIntro': 'src/assets/images/freeSpinsIntro',
        'audio': 'src/assets/audio'
    };

    // Track processed files to avoid duplicates
    const processedFiles = new Set<string>();

    // Scan each bundle directory
    for (const [bundleName, dirPath] of Object.entries(bundleDirs)) {
        if (fs.existsSync(dirPath)) {
            const assets = scanDirectory(dirPath, bundleName);
            // Filter out duplicates and empty assets
            const uniqueAssets = assets.filter(asset => {
                const key = `${bundleName}-${asset.alias}`;
                if (processedFiles.has(key)) {
                    console.log(`Skipping duplicate asset: ${key}`);
                    return false;
                }
                processedFiles.add(key);
                return true;
            });

            if (uniqueAssets.length > 0) {
                manifest.bundles.push({
                    name: bundleName,
                    assets: uniqueAssets
                });
            }
        }
    }

    return manifest;
}

function generateLoaderConfig(): string {
    const manifest = generateManifest();
    
    return `import { Assets } from 'pixi.js';
import { Globals } from '../Global';
import { Howl } from 'howler';

type ProgressCallback = (progress: number) => void;

export const manifest = ${JSON.stringify(manifest, null, 4)};

export async function initAssets(): Promise<void> {
    console.log('Initializing assets...');
    try {
        // Initialize PixiJS assets
        await Assets.init({ manifest });
        console.log('Assets initialization complete');
    } catch (error) {
        console.error('Error initializing assets:', error);
        throw error;
    }
}

export async function loadBundle(bundleName: string, onProgress?: ProgressCallback): Promise<any> {
    console.log(\`Starting to load bundle: \${bundleName}\`);
    try {
        if (bundleName === 'audio') {
            // Handle audio bundle separately using Howler.js
            const bundle = manifest.bundles.find(b => b.name === bundleName);
            if (!bundle) {
                throw new Error('Audio bundle not found in manifest');
            }

            const totalAssets = bundle.assets.length;
            let loadedAssets = 0;
            const audioAssets: { [key: string]: Howl } = {};

            for (const asset of bundle.assets) {
                const howl = new Howl({
                    src: [asset.src],
                    onload: () => {
                        loadedAssets++;
                        const progress = loadedAssets / totalAssets;
                        if (onProgress) {
                            onProgress(progress);
                        }
                        console.log(\`Loading progress for \${bundleName}: \${(progress * 100).toFixed(2)}%\`);
                    },
                    onloaderror: (id, error) => {
                        console.error(\`Error loading audio asset \${asset.alias}:\`, error);
                    }
                });

                audioAssets[asset.alias] = howl;
                Globals.soundResources[asset.alias] = howl;
                console.log(\`Stored sound "\${asset.alias}" in Globals.soundResources\`);
            }

            return audioAssets;
        } else {
            // Handle other bundles with PixiJS Assets
        const bundle = await Assets.loadBundle(bundleName, (progress) => {
            console.log(\`Loading progress for \${bundleName}: \${(progress * 100).toFixed(2)}%\`);
            if (onProgress) {
                onProgress(progress);
            }
        });
        
        console.log(\`Bundle \${bundleName} loaded successfully\`);
        
        for (const [key, asset] of Object.entries(bundle)) {
                Globals.resources[key] = asset;
                console.log(\`Stored asset "\${key}" in Globals.resources\`);
            }
            
            return bundle;
        }
    } catch (error) {
        console.error(\`Error loading bundle \${bundleName}:\`, error);
        throw error;
    }
}

export async function unloadBundle(bundleName: string): Promise<void> {
    console.log(\`Unloading bundle: \${bundleName}\`);
    try {
        if (bundleName === 'audio') {
            // Unload audio assets
        const bundleAssets = manifest.bundles.find(b => b.name === bundleName)?.assets || [];
        for (const asset of bundleAssets) {
                const howl = Globals.soundResources[asset.alias] as Howl;
                if (howl) {
                    howl.unload();
                delete Globals.soundResources[asset.alias];
                console.log(\`Removed sound "\${asset.alias}" from Globals.soundResources\`);
                }
            }
            } else {
            // Unload other assets
            await Assets.unloadBundle(bundleName);
            const bundleAssets = manifest.bundles.find(b => b.name === bundleName)?.assets || [];
            for (const asset of bundleAssets) {
                delete Globals.resources[asset.alias];
                console.log(\`Removed asset "\${asset.alias}" from Globals.resources\`);
            }
        }
        
        console.log(\`Bundle \${bundleName} unloaded successfully\`);
    } catch (error) {
        console.error(\`Error unloading bundle \${bundleName}:\`, error);
        throw error;
    }
}

export async function backgroundLoadBundle(bundleName: string): Promise<void> {
    console.log(\`Starting background load for bundle: \${bundleName}\`);
    try {
        if (bundleName === 'audio') {
            // Background loading for audio is handled by Howler.js automatically
            console.log('Audio bundle background loading is handled by Howler.js');
        } else {
        await Assets.backgroundLoadBundle(bundleName);
        }
        console.log(\`Background loading complete for bundle: \${bundleName}\`);
    } catch (error) {
        console.error(\`Error background loading bundle \${bundleName}:\`, error);
        throw error;
    }
}`;
}

// Generate and write the loader config
const loaderConfig = generateLoaderConfig();
fs.writeFileSync('src/utils/LoaderConfig.ts', loaderConfig);

console.log('LoaderConfig.ts has been generated successfully!'); 