import * as fs from 'fs';
import * as path from 'path';
import { bundleConfigs, BundleConfig, SpriteSheetConfig } from '../config/loaderGeneratorConfig';

interface Asset {
    alias: string;
    src: string;
    data?: {
        frames: { [key: string]: any };
        meta: any;
    };
}

interface Bundle {
    name: string;
    assets: Asset[];
}

interface Manifest {
    bundles: Bundle[];
}

function isSpriteSheetSequence(file: string, spriteSheetConfig: SpriteSheetConfig): boolean {
    return spriteSheetConfig.pattern.test(file);
}

function getSpriteSheetData(files: string[], basePath: string, config: SpriteSheetConfig): { frames: { [key: string]: any }, meta: any } {
    const frames: { [key: string]: any } = {};
    
    // Sort files to ensure correct frame order
    const sortedFiles = files.sort((a, b) => {
        const matchA = a.match(config.pattern);
        const matchB = b.match(config.pattern);
        if (!matchA || !matchB) return 0;
        return parseInt(matchA[1]) - parseInt(matchB[1]);
    });

    // Calculate total frames and frame rate
    const totalFrames = sortedFiles.length;
    const frameRate = config.frameRate || 30; // Use configured frame rate or default to 30

    sortedFiles.forEach((file, index) => {
        const frameName = path.basename(file, path.extname(file));
        frames[frameName] = {
            frame: { x: 0, y: 0, w: config.frameWidth, h: config.frameHeight },
            sourceSize: { w: config.frameWidth, h: config.frameHeight },
            spriteSourceSize: { x: 0, y: 0, w: config.frameWidth, h: config.frameHeight },
            rotated: false,
            trimmed: false,
            duration: 1000 / frameRate // Duration in milliseconds
        };
    });

    return {
        frames,
        meta: {
            image: sortedFiles[0],
            format: "RGBA8888",
            size: { w: config.frameWidth, h: config.frameHeight },
            scale: "1",
            frames: totalFrames,
            frameRate: frameRate,
            duration: (totalFrames * 1000) / frameRate, // Total duration in milliseconds
            animations: {
                default: sortedFiles.map(file => path.basename(file, path.extname(file)))
            },
            version: "1.0",
            generated: new Date().toISOString()
        }
    };
}

function generateAlias(filePath: string, bundleName: string): string {
    const dirName = path.dirname(filePath).split(path.sep).pop() || '';
    const fileName = path.basename(filePath, path.extname(filePath));
    return `${bundleName}-${dirName}-${fileName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function scanDirectory(dirPath: string, bundleConfig: BundleConfig): Asset[] {
    const assets: Asset[] = [];
    const files = fs.readdirSync(dirPath);
    const spriteSheetGroups = new Map<string, { files: string[], config: SpriteSheetConfig }>();

    // First pass: Group potential sprite sheet sequences
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively scan subdirectories
            const subDirAssets = scanDirectory(fullPath, bundleConfig);
            assets.push(...subDirAssets);
        } else if (stat.isFile()) {
            if (/\.(png|jpg|jpeg)$/i.test(file)) {
                // Check if file matches any sprite sheet pattern
                if (bundleConfig.spriteSheets) {
                    for (const [key, config] of Object.entries(bundleConfig.spriteSheets)) {
                        if (isSpriteSheetSequence(file, config)) {
                            const baseName = key;
                            if (!spriteSheetGroups.has(baseName)) {
                                spriteSheetGroups.set(baseName, { files: [], config });
                            }
                            spriteSheetGroups.get(baseName)?.files.push(fullPath);
                            break;
                        }
                    }
                }
            } else if (/\.(mp3|ogg)$/i.test(file) && bundleConfig.audio) {
                // Handle audio files
                const relativePath = path.relative('src', fullPath).replace(/\\/g, '/');
                const asset: Asset = {
                    alias: `${bundleConfig.name}-${path.basename(file, path.extname(file))}`,
                    src: `/${relativePath}`
                };
                assets.push(asset);
            }
        }
    }

    // Second pass: Process sprite sheets and regular images
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && /\.(png|jpg|jpeg)$/i.test(file)) {
            let isSpriteSheet = false;
            
            // Check if file is part of a sprite sheet
            if (bundleConfig.spriteSheets) {
                for (const [key, config] of Object.entries(bundleConfig.spriteSheets)) {
                    if (isSpriteSheetSequence(file, config)) {
                        const group = spriteSheetGroups.get(key);
                        if (group && group.files.length > 0 && fullPath === group.files[0]) {
                            const relativePath = path.relative('src', dirPath).replace(/\\/g, '/');
                            const asset: Asset = {
                                alias: generateAlias(path.join(dirPath, key), bundleConfig.name),
                                src: `/${relativePath}/${file}`,
                                data: getSpriteSheetData(group.files, dirPath, config)
                            };
                            assets.push(asset);
                            isSpriteSheet = true;
                        }
                        break;
                    }
                }
            }

            if (!isSpriteSheet) {
                // Regular image
                const relativePath = path.relative('src', fullPath).replace(/\\/g, '/');
                const asset: Asset = {
                    alias: generateAlias(fullPath, bundleConfig.name),
                    src: `/${relativePath}`
                };
                assets.push(asset);
            }
        }
    }

    return assets;
}

function generateManifest(): Manifest {
    const manifest: Manifest = {
        bundles: []
    };

    // Scan each bundle directory
    for (const bundleConfig of bundleConfigs) {
        if (fs.existsSync(bundleConfig.path)) {
            const assets = scanDirectory(bundleConfig.path, bundleConfig);
            if (assets.length > 0) {
                manifest.bundles.push({
                    name: bundleConfig.name,
                    assets: assets
                });
            }
        }
    }

    return manifest;
}

function generateLoaderConfig(): string {
    const manifest = generateManifest();
    
    return `import { Assets } from 'pixi.js';

export const manifest = ${JSON.stringify(manifest, null, 4)};
`;
}

// Clear the existing LoaderConfig.ts file
fs.writeFileSync('src/core/config/LoaderConfig.ts', '');

// Generate and write the new loader config
const generatedConfig = generateLoaderConfig();
fs.writeFileSync('src/core/config/LoaderConfig.ts', generatedConfig);

console.log('LoaderConfig.ts has been generated successfully!'); 