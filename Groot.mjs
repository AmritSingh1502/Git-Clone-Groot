import  path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

class Groot {
    constructor(repoPath = '.'){
        this.repoPath = path.join(repoPath, '.groot');
        this.objectsPath = path.join(this.repoPath, '.objects'); //.groot/objects
        this.headPath = path.join(this.repoPath, '.HEAD'); //.groot/HEAD
        this.indexPath = path.join(this.repoPath, 'index'); // .groot/index
        this.init();
    }

    async init(){
        await fs.mkdir(this.objectsPath, {recursive: true});
        try{
            await fs.writeFile(this.headPath,'',{flag: 'wx'}); // wx : open for writing. fails if file exists
            await fs.writeFile(this.indexPath,JSON.stringify([]),{flag: 'wx'});
        }catch(error){
            console.log("Already  intialized the .groot folder");
        }
    }

    hashObject(content){
        return crypto.createHash('sha1').update(content,'utf-8').digest('hex');
    }

    async add(fileToBeAdded){
        //fileToBeAdded: path/to/file
        const fileData = await fs.readFile(fileToBeAdded, { encoding: 'utf-8'}); // read the file
        const fileHash = this.hashObject(fileData); // hash the file
        console.log(fileHash);
        const newFileHashedObjectPath = path.join(this.objectsPath, fileHash);// .groot/objects//abc123
        await fs.writeFile(newFileHashedObjectPath,fileData);
        //TODO: One step Missing: Add the file to staging area
        console.log(`Added ${fileToBeAdded}`);
    }

    async updateStagingArea(filePath, fileHash){
        const index = JSON.parse(await fs.readFile(this.indexPath, { encoding: 'utf-8'})); // read the index file
        index.push({ path : fileHash , hash: fileHash }); // add the file to the index
        await fs.writeFile(this.indexPath, JSON.stringify(index)); // write the updated index file
    }
}

const groot = new Groot();
groot.add('./sample.txt');