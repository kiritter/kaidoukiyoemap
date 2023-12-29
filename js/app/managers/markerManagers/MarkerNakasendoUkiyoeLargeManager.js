(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerNakasendoUkiyoeLargeManager = class MarkerNakasendoUkiyoeLargeManager {
        constructor(gaChannel, mapBoth, globalState, chapterNum) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;
            this.chapterNum = chapterNum;

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
            var layerName = 'route_nakasendo_ukiyoe_large';
            var callbacks = {
                'tooltipContentCallback': null,
                'popupContentCallback': MarkerNakasendoUkiyoeLargeManager._buildPopupContent,
                'filterGeojsonPredicate': MarkerNakasendoUkiyoeLargeManager._filterGeojsonPredicate,
            };
            var options = {
                shouldCircleMarker: false,
                circleMarkerColNames: null,
                shouldTooltip: false,
                tooltipNames: null,
                shouldPopup: true,
                popupOptionValues: {maxWidth: 830},
                resourceIdColName: 'ukiyoeMarkerId',
                isCustomIconMarker: false,
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
`;
            return content;
        }

        static _buildPopupContent(properties) {
            var subTitlePart = (properties.ukiyoeSubTitle === '' || properties.ukiyoeSubTitle === '-') ? '' : ` (${properties.ukiyoeSubTitle})`;
            var attrWithoutBr = properties.ukiyoeAttribution.replaceAll('<br>', '');
            var content = `
<table class="event-table">
    <tbody>
        <tr>
            <th class="table-ukiyoe-title table-ukiyoe-nakasendo">${properties.ukiyoeTitle}${subTitlePart}</th>
        </tr>
        <tr>
            <td><img src="${properties.ukiyoeLargeUrl}"></td>
        </tr>
        <tr>
            <td class="table-ukiyoe-attr">${attrWithoutBr}</td>
        </tr>
    </tbody>
</table>
`;
            return content;
        }

        static _filterGeojsonPredicate(properties) {
            if (properties.isUkiyoePoint === true) {
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
