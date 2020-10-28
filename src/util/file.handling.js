const fs = require("fs");
const path = require("path");
const EXTENSION = /\.(mp3|wav)$/i;

let musicRoot = process.argv[2];

let fileList = fs.readdirSync(musicRoot);

// console.log(fileList);

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

let musicList = fileList.filter((music) => {
    // 筛选出所有的音乐文件
    return EXTENSION.test(path.extname(music));
});
// 遍历音乐文件，进行文件夹的修改
for (let i = 0; i < musicList.length; i++) {
    let music = musicList[i];
    let musicId = uuid();

    let musicStats = fs.statSync(path.join(musicRoot, music));
    let musicTitle = path.basename(music, path.extname(music));
    let metadata = {
        id: musicId,
        title: musicTitle,
        ext: path.extname(music),
        encodedTitle: encodeURI(musicTitle),
        artist: "",
        pic: "",
        lrc: "",
        playList: [],
        size: musicStats.size,
        modifiedTime: musicStats.mtimeMs,
        birthTime: musicStats.birthtimeMs
    };
    let musicDir = path.join(musicRoot, musicId + ".info");
    fs.mkdir(musicDir, () => {
        fs.writeFile(
            path.join(musicDir, "metadata.json"),
            JSON.stringify(metadata),
            () => {
                // 移动歌曲到对应文件夹中
                fs.readFile(path.join(musicRoot, music), (err, data) => {
                    if (err) {
                        throw err;
                    }
                    fs.writeFile(path.join(musicDir, music), data, () => {
                        fs.unlink(path.join(musicRoot, music), () => {});
                    });
                });
            }
        );
    });
}

function configMetadata() {}
