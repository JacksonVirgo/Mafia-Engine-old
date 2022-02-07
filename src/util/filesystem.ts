import glob from 'glob';
import { promisify } from 'util';

let globPromise = promisify(glob);

/**
 * Get all file paths directly within a set directory
 * @param path Absolute path of a directory
 * @param onEach function to run for each path found.
 * @returns array of file paths.
 */
export const loadFiles = async (path: string, onEach: (value: string) => void = () => {}): Promise<string[] | undefined> => {
	let paths: string[] | undefined = [];
	let data = await globPromise(`${path}/*{.ts,.js}`); //, (err: any, res: any) => {
	data.forEach((element: string) => {
		if (!element.endsWith('.d.ts')) {
			paths?.push(element);
			onEach(element);
		}
	});
	return paths;
};

/**
 * Get all file paths within a directory and all subdirectories.
 * @param path Absolute file path
 * @param onEach Function to run on all files
 * @returns array of file paths
 */
export const loadFilesRecursive = async (path: string, onEach: (value: string) => void = () => {}): Promise<string[] | undefined> => {
	return loadFiles(path, onEach);
};
