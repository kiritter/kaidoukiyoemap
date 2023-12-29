(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.LineCoreManager = class LineCoreManager {
        constructor(mapBoth, globalState, layerName, targetTimeRangeType, targetUrl) {
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.layerName = layerName;
            this.targetTimeRangeType = targetTimeRangeType;
            this.targetUrl = targetUrl;

            this.layerGroupLeft = L.layerGroup();

            this.geojson;
        }

        async init() {
            this.addEventListenersToMap();

            this.geojson = await this.findPlaceData();
            var pathLayerGroup = this._createPathLayerGroup(this.geojson);
            this.layerGroupLeft.addLayer(pathLayerGroup);
        }



        addEventListenersToMap() {
            if (this.layerName === '') {
                if (this.globalState.timeRangeType === this.targetTimeRangeType) {
                    this.layerGroupLeft.addTo(this.mapLeft);
                }
                return;
            }

            var self = this;
            this.mapLeft.on('overlayadd', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                    if (self.mapLeft.hasLayer(self.layerGroupLeft) === false) {
                        if (self.globalState.timeRangeType === self.targetTimeRangeType) {
                            self.layerGroupLeft.addTo(self.mapLeft);
                        }
                    }
                }else{
                }
            });
            this.mapLeft.on('overlayremove', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                }else{
                    if (self.mapLeft.hasLayer(self.layerGroupLeft)) {
                        if (self.globalState.timeRangeType === self.targetTimeRangeType) {
                            self.layerGroupLeft.removeFrom(self.mapLeft);
                        }
                    }
                }
            });
        }

        clearLayers() {
            this.layerGroupLeft.removeFrom(this.mapLeft);
        }

        redrawLayers() {
            if (this.layerName === '') {
                if (this.globalState.timeRangeType === this.targetTimeRangeType) {
                    this.layerGroupLeft.addTo(this.mapLeft);
                }
                return;
            }

            var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(this.mapLeft, this.layerName);
            if (targetLayer) {
                if (this.globalState.timeRangeType === this.targetTimeRangeType) {
                    this.layerGroupLeft.addTo(this.mapLeft);
                }
            }else{
            }
        }

        async findPlaceData() {
            var res = await fetch(this.targetUrl);
            return res.json();
        }

        _getPathInfoList(geojson) {
            var pathInfoList = geojson.features.map((feature) => {
                return {
                    lat: feature.geometry.coordinates[1],
                    lng: feature.geometry.coordinates[0],
                    isPathPoint: feature.properties.isPathPoint,
                    pathWeight: (feature.properties.pathWeight ? feature.properties.pathWeight : 0),
                    pathColor: (feature.properties.pathColor ? feature.properties.pathColor : ''),
                    pathDashArray: (feature.properties.pathDashArray ? feature.properties.pathDashArray : null),
                    pathOpacity: (feature.properties.pathOpacity ? feature.properties.pathOpacity : 0.0),
                };
            });
            return pathInfoList;
        }

        _getAlwaysVisiblePointInfoList(geojson) {
            var pathInfoList = geojson.features.map((feature) => {
                return {
                    lat: feature.geometry.coordinates[1],
                    lng: feature.geometry.coordinates[0],
                    isAlwaysVisiblePoint: feature.properties.isAlwaysVisiblePoint,
                };
            });
            return pathInfoList;
        }

        _createPathLayerGroup(geojson) {
            var layerGroup = L.layerGroup();

            var lineInfoList = this._retrieveLineInfoList(geojson);
            var lineLayerGroup = this._createLineLayerGroup(lineInfoList);
            layerGroup.addLayer(lineLayerGroup);

            var pointInfoList = this._retrievePointInfoList(geojson);
            var pointLayerGroup = this._createPointLayerGroup(pointInfoList);
            layerGroup.addLayer(pointLayerGroup);

            return layerGroup;
        }

        _retrieveLineInfoList(geojson) {
            var pathInfoList = this._getPathInfoList(geojson);
            var filteredList =  pathInfoList.filter((point) => point.isPathPoint === true);
            return filteredList;
        }

        _createLineLayerGroup(lineInfoList) {
            var layerGroup = L.layerGroup();

            var appliedPathOption = null;
            var latlngList = [];

            var len = lineInfoList.length;
            for (var i = 0; i < len; i++) {
                var lineInfo= lineInfoList[i];
                this._pushLatLng(latlngList, lineInfo);

                var currentPathOption = this._retrievePathOption(lineInfo);
                if (i === 0) {
                    if (this._hasPathOption(currentPathOption)) {
                        appliedPathOption = currentPathOption;
                    }else{
                    }
                    continue;
                }
                if (i === 1) {
                    if (appliedPathOption === null) {
                        appliedPathOption = currentPathOption;
                    }
                }

                if (this._hasChangedPathOption(appliedPathOption, currentPathOption) === false) {
                    if (i < len - 1) {
                        continue;
                    }
                }

                var polyline = this._createPolyline(latlngList, appliedPathOption);
                layerGroup.addLayer(polyline);

                latlngList = [];
                this._pushLatLng(latlngList, lineInfo);
                appliedPathOption = currentPathOption;
            }

            return layerGroup;
        }

        _pushLatLng(latlngList, lineInfo) {
            latlngList.push([lineInfo.lat, lineInfo.lng]);
        }

        _retrievePathOption(lineInfo) {
            var option = {
                weight: lineInfo.pathWeight,
                color: lineInfo.pathColor,
                dashArray: lineInfo.pathDashArray,
                opacity: lineInfo.pathOpacity,
            };
            return option;
        }

        _hasPathOption(current) {
            if (current.weight === 0 && current.color === '' && current.dashArray === null && current.opacity === 0.0) {
                return false;
            }
            return true;
        }

        _hasChangedPathOption(applied, current) {
            if (current.weight === 0 && current.color === '' && current.dashArray === null && current.opacity === 0.0) {
                return false;
            }
            if (applied.weight === current.weight && applied.color === current.color && applied.dashArray === current.dashArray && applied.opacity === current.opacity) {
                return false;
            }
            return true;
        }

        _createPolyline(latlngList, appliedPathOption) {
            var polyline = L.polyline(latlngList, appliedPathOption);
            return polyline;
        }

        _retrievePointInfoList(geojson) {
            var pointInfoList = this._getAlwaysVisiblePointInfoList(geojson);
            var filteredList =  pointInfoList.filter((point) => point.isAlwaysVisiblePoint === true);
            return filteredList;
        }

        _createPointLayerGroup(pointInfoList) {
            var layerGroup = L.layerGroup();

            var options = {
                radius: 3,
                color: '#000',
                fill: true,
                fillColor: '#000',
                fillOpacity: 1.0,
            };

            var len = pointInfoList.length;
            for (var i = 0; i < len; i++) {
                var pointInfo= pointInfoList[i];
                var center = L.latLng(pointInfo.lat, pointInfo.lng);
                var circle = L.circleMarker(center, options);
                layerGroup.addLayer(circle);
            }

            return layerGroup;
        }

    };

}(this));
