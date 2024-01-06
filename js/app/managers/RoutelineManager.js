(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.RoutelineManager = class RoutelineManager {
        constructor(gaChannel, mapBoth, globalState, myChannel) {
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.myChannel = myChannel;

            this.pathTokaidoManager = new MyApp.PathTokaidoManager(mapBoth, globalState);
            this.tokaidoStationPointManager = new MyApp.MarkerTokaidoStationPointManager(null, mapBoth, globalState);
            this.tokaidoSpotPointManager = new MyApp.MarkerTokaidoSpotPointManager(null, mapBoth, globalState);
            this.tokaidoUkiyoeThmbManager = new MyApp.MarkerTokaidoUkiyoeThmbManager(null, mapBoth, globalState);
            this.tokaidoUkiyoeLargeManager = new MyApp.MarkerTokaidoUkiyoeLargeManager(gaChannel, mapBoth, globalState);

            this.pathNakasendoManager = new MyApp.PathNakasendoManager(mapBoth, globalState);
            this.nakasendoStationPointManager = new MyApp.MarkerNakasendoStationPointManager(null, mapBoth, globalState);
            this.nakasendoSpotPointManager = new MyApp.MarkerNakasendoSpotPointManager(null, mapBoth, globalState);
            this.nakasendoUkiyoeThmbManager = new MyApp.MarkerNakasendoUkiyoeThmbManager(null, mapBoth, globalState);
            this.nakasendoUkiyoeLargeManager = new MyApp.MarkerNakasendoUkiyoeLargeManager(gaChannel, mapBoth, globalState);
        }

        async init() {
            await this._initAll();


            this.settingMyChannel(this.myChannel);
        }

        async _initAll() {
            var promiseList = [];

            promiseList.push(this.pathNakasendoManager.init());
            promiseList.push(this.nakasendoStationPointManager.init());
            promiseList.push(this.nakasendoSpotPointManager.init());
            promiseList.push(this.nakasendoUkiyoeThmbManager.init());
            promiseList.push(this.nakasendoUkiyoeLargeManager.init());

            promiseList.push(this.pathTokaidoManager.init());
            promiseList.push(this.tokaidoStationPointManager.init());
            promiseList.push(this.tokaidoSpotPointManager.init());
            promiseList.push(this.tokaidoUkiyoeThmbManager.init());
            promiseList.push(this.tokaidoUkiyoeLargeManager.init());

            await Promise.all(promiseList);
        }

        settingMyChannel(myChannel) {
        }

    };

}(this));
