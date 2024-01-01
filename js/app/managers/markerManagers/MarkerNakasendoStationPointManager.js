(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerNakasendoStationPointManager = class MarkerNakasendoStationPointManager {
        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/10_path_point_event/02a_nakasendo.geojson'},
            ];

            this.coreManagerByKey = this._createCoreManagerMap();
        }

        _createCoreManagerMap() {
            var coreManagerByKey = new Map();
            var self = this;
            this.list.forEach((el) => {
                var coreManager = self._createCoreManager(el.timeRangeType, el.url);
                coreManagerByKey.set(`${el.timeRangeType}`, coreManager);
            });
            return coreManagerByKey;
        }
        _createCoreManager(targetTimeRangeType, targetUrl) {
            var layerName = 'route_nakasendo';
            var callbacks = {
                'tooltipContentCallback': MarkerNakasendoStationPointManager._buildTooltipContent,
                'popupContentCallback': null,
                'filterGeojsonPredicate': MarkerNakasendoStationPointManager._filterGeojsonPredicate,
            };
            var options = {
                shouldCircleMarker: true,
                circleMarkerColNames: {radius: 'stationPointCircleMarkerRadius', color: 'stationPointCircleMarkerColor', isFill: 'stationPointCircleMarkerIsFill'},
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-station-point', geZoom: 'stationPointTooltipGeZoom', direction: 'stationPointTooltipDirection'},
                shouldPopup: false,
                popupNames: null,
            };
            var coreManager = new MyApp.MarkerCoreManager(this.gaChannel, this.mapBoth, this.globalState, layerName, callbacks, options, targetTimeRangeType, targetUrl);
            return coreManager;
        }

        async init() {
            var promiseList = [];
            for (var [key, coreManager] of this.coreManagerByKey) {
                promiseList.push(coreManager.init());
            }
            await Promise.all(promiseList);
        }

        static _buildTooltipContent(properties) {
            var content = `
<div>
    <div class="tooltip-station-point-name">${properties.stationPointName}</div>
</div>
`;
            return content;
        }

        static _buildPopupContent(properties) {
            var content = `
`;
            return content;
        }

        static _filterGeojsonPredicate(properties) {
            if (properties.isStationPoint === true) {
                return true;
            }
            return false;
        }

        redraw(selectedTimeRangeType) {
            for (var [key, coreManager] of this.coreManagerByKey) {
                coreManager.clearLayers();
            }

            var currentTimeRangeType = selectedTimeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            targetCoreManager.redrawLayers();
        }

    };

}(this));
