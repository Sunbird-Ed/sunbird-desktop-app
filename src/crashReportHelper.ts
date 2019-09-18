import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";
import * as miniDump from 'minidump';
import { crashReporter, app } from "electron";
const envs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "env.json"), { encoding: "utf-8" })
);

export class CrashReportService {
  init() {
    miniDump.addSymbolPath('./../breakpad_symbols')
    app.setPath('temp', app.getPath("userData"))
    const crashLogPath = app.getPath("userData") + '/' + envs.APP_ID + ' Crashes/completed/';
    crashReporter.start({
      productName: envs.APP_ID,
      companyName: envs.APP_NAME,
      submitURL: envs.APP_BASE_URL + '/crashReport',
      uploadToServer: false
    });
    const syncCrashDmpFiles = (path, fileName) => {
      miniDump.walkStack(path + fileName, path, (err, data) => {
        if(err) return console.error(err);
        fs.writeFile(__dirname + fileName.split('.')[0] + '.txt', data.toString(), function(err) {
          if(err) return console.error(err);
          console.log('------------read crash log in file-----------', fs.statSync(path + fileName));
        });
      })
    }
    setTimeout(() => {
      console.log('electron crash logs are stored in : ', app.getPath("userData") + '/' + envs.APP_ID + ' Crashes');
      fs.readdirSync(crashLogPath).forEach(file => {
        syncCrashDmpFiles(crashLogPath, file);
      });
    }, 10000)
    // setTimeout(process.crash, 10000)
  }
}
