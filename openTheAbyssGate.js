const fs = require("fs");
const path = require("path");
const os = require("os");

//奈落の神
class Tartaros {
  constructor() {
    this.desktopPath = path.join(os.homedir(), "Desktop");
    this.setAbyssPath("abyss");
    this.fallenContentsNames = [];
  }

  //デスクトップに配置するアビス一式のフォルダ名
  setAbyssPath(abyssFolderName) {
    this.abyssPath = path.join(this.desktopPath, abyssFolderName);
    this.setExcludedFilePath(); //ついでに移動しないファイル一覧パスを設定
    this.setAbyssPitPath(); //ついでに移動先フォルダのパスを設定
  }

  //移動しないファイル一覧のパス設定
  setExcludedFilePath() {
    this.excludedFilePath = path.join(this.abyssPath, "excluded.txt");
  }

  //移動ファイルの行先フォルダパス
  setAbyssPitPath() {
    this.AbyssPitPath = path.join(this.abyssPath, "pit");
  }

  //移動しないファイル一覧を読み込む
  readExcludedFilesList() {
    //一行ずつ配列格納
    this.excludedFiles = fs
      .readFileSync(this.excludedFilePath, "utf-8")
      .split("\n");
  }

  //デスクトップ内のファイルとフォルダを読み込む
  listDesktopContents() {
    this.desktopContents = fs.readdirSync(this.desktopPath);
  }

  //指定したファイル・フォルダが移動しないファイル一覧に記載されているか確認する
  isExistsInList(name) {
    for (let i = 0; i < this.excludedFiles.length; i++) {
      if (name == this.excludedFiles[i]) {
        return true;
      }
    }
    return false;
  }

  //指定したファイルやフォルダをアビスに送る
  moveContentToAbyss(content) {
    const oldPath = path.join(this.desktopPath, content);
    const newPath = path.join(this.AbyssPitPath, content);
    fs.renameSync(oldPath, newPath);
    this.AddToListFallenContents(content);
  }

  //アビスに送ったファイル・フォルダの名前を配列格納
  AddToListFallenContents(content) {
    this.fallenContentsNames.push(content);
  }

  //アビスに送ったファイル・フォルダを全て出力
  outputFallenContents() {
    if (this.fallenContentsNames.length == 0) {
      console.log("there were no target contents.");
      return;
    }
    console.log("The following files were sent to the abyss.");
    for (let i = 0; i < this.fallenContentsNames.length; i++) {
      console.log(this.fallenContentsNames[i]);
    }
  }

  //デスクトップの全ての不要なファイル・フォルダをアビスに送る
  moveAllContentsToAbyss() {
    console.log();
    console.log(
      "//////////////////// open the abyss gate ///////////////////////"
    );
    this.listDesktopContents();
    this.readExcludedFilesList();
    this.desktopContents.forEach((content) => {
      if (!this.isExistsInList(content)) {
        this.moveContentToAbyss(content);
      }
    });
    this.outputFallenContents();
    console.log(
      "//////////////////////////// end ///////////////////////////////"
    );
  }

  //デスクトップ上に存在する全コンテンツを移動しないリストに追加
  updateExcludedList() {
    this.listDesktopContents();
    let strings = "";
    for (let i = 0; i < this.desktopContents.length; i++) {
      strings += this.desktopContents[i] + "\n";
    }
    fs.writeFileSync(this.excludedFilePath, strings);
  }
}

const abyssRuler = new Tartaros();

switch (process.argv[2]) {
  case "remove":
    abyssRuler.moveAllContentsToAbyss();
    break;
  case "update":
    process.argv[2];
    abyssRuler.updateExcludedList();
    break;

  default:
    console.log("something is wrong.");
    break;
}
