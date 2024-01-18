(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};
    MyApp.configMap = {};

    MyApp.configMap.TileType = {
        Empty: 1,
        Standard: 2,
        Colorized: 3,
        OldEdition: 4,
        MyZxy: 5,
    };

    MyApp.configMap.MapLeftBaseList = [
        {name: 'osm', selected: true},
    ];
    MyApp.configMap.MapLeftOverlayList = [
        {name: 'old_edition', selected: false},
        {name: 'ort_old10', selected: false},
        {name: 'latest', selected: false},
        {name: 'hillshade', selected: true},
        {name: `route_nakasendo`, selected: true},
        {name: `route_nakasendo_ukiyoe_thmb`, selected: true},
        {name: `route_nakasendo_ukiyoe_large`, selected: true},
        {name: `route_tokaido`, selected: true},
        {name: `route_tokaido_ukiyoe_thmb`, selected: true},
        {name: `route_tokaido_ukiyoe_large`, selected: true},
        {name: 'recommend_100meizan', selected: false},
    ];

    MyApp.configMap.LayerConfigTable = {
        'osm': {
            caption: 'OpenStreetMap',
            options: {
                myTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 18,
                myLayerName: 'osm',
                myCacheName: 'osm',
                myCacheRepo: MyApp.globalCacheRepo,
            },
        },


        'ort_old10': {
            caption: '1961-1969年(昭和36-44年) (Zoom:10-17)',
            options: {
                myTileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/ort_old10/{z}/{x}/{y}.png',
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 17,
                myLayerName: 'ort_old10',
                myCacheName: 'ort_old10',
                myCacheRepo: MyApp.globalCacheRepo,
            },
        },
        'latest': {
            caption: '最新 (Zoom:5-8,9-13,14-18)',
            options: {
                myTileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 18,
                myLayerName: 'latest',
                myCacheName: 'latest',
                myCacheRepo: MyApp.globalCacheRepo,
                addSeparatorToBottom: true,
            },
        },
        'hillshade': {
            caption: '陰影起伏図 (Zoom:5-16)',
            options: {
                myTileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png',
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 16,
                opacity: 0.5,
                myLayerName: 'hillshade',
                myCacheName: 'hillshade',
                myCacheRepo: MyApp.globalCacheRepo,
                blockDescription: '陰影起伏図を重ねて表示できます',
                blockDescriptionCssClassName: 'block-description',
                addSeparatorToBottom: true,
            },
        },

        'old_edition': {
            caption: '旧版地図(日本版MapWarper[五万分一地形圖]) (Zoom:10-15)',
            tileType: MyApp.configMap.TileType.OldEdition,
            options: {
                myTileUrl: 'https://mapwarper.h-gis.jp/maps/tile/{area_id}/{z}/{x}/{y}.png',
                attribution: `<a href='https://mapwarper.h-gis.jp/about' target='_blank'>日本版MapWarper</a>`,
                minZoom: 10,
                maxZoom: 18,
                maxNativeZoom: 15,
                myLayerName: 'old_edition',
                myCacheName: 'old_edition',
                myCacheRepo: MyApp.globalCacheRepo,
                myOldEditionMapIdLocalRepo: MyApp.oldEditionMapIdLocalRepo,
                myOldEditionMapIdCacheRepo: MyApp.oldEditionMapIdCacheRepo,
                blockDescription: '戦前期の地図、航空写真を表示できます（いずれか1つ）',
                blockDescriptionCssClassName: 'block-description',
            },
        },

        'route_tokaido': {
            caption: '東海道の宿場 (及びそれらを結んだ線)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: `route_tokaido`,
            },
        },
        'route_tokaido_ukiyoe_thmb': {
            caption: '浮世絵：東海道五十三次 (サムネイル表示)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: `route_tokaido_ukiyoe_thmb`,
            },
        },
        'route_tokaido_ukiyoe_large': {
            caption: '浮世絵：東海道 (Markerクリックで大きいサイズ表示)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: `route_tokaido_ukiyoe_large`,
                addSeparatorToBottom: true,
            },
        },

        'route_nakasendo': {
            caption: '中山道の宿場 (及びそれらを結んだ線)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: `route_nakasendo`,
                blockDescription: '宿場名や浮世絵を表示します',
                blockDescriptionCssClassName: 'block-description',
            },
        },
        'route_nakasendo_ukiyoe_thmb': {
            caption: '浮世絵：木曽海道六十九次 (サムネイル表示)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: `route_nakasendo_ukiyoe_thmb`,
            },
        },
        'route_nakasendo_ukiyoe_large': {
            caption: '浮世絵：木曽海道 (Markerクリックで大きいサイズ表示)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: `route_nakasendo_ukiyoe_large`,
                addSeparatorToBottom: true,
            },
        },
        'recommend_100meizan': {
            caption: 'おまけ：日本百名山',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'recommend_100meizan',
                isLastElement: true,
                lastElementLinkInfoList: [
                    {
                        sourceSummaryUrl: 'html/source_summary.html',
                        sourceSummaryText: '地図データの出典情報、街道の宿場/浮世絵の出典情報',
                        sourceSummaryNote: '',
                        sourceSummaryCssClassName: 'source-summary-link',
                    },
                    {
                        sourceSummaryUrl: '../#product-map',
                        sourceSummaryText: '当Webサイトの兄弟地図サイトを見る',
                        sourceSummaryNote: '',
                        sourceSummaryCssClassName: 'source-summary-link',
                    },
                ],
            },
        },

    };

}(this));
