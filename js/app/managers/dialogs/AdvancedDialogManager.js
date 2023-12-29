(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.AdvancedDialogManager = class AdvancedDialogManager {
        constructor(gaChannel, permanentCacheManager) {
            this.gaChannel = gaChannel;
            this.permanentCacheManager = permanentCacheManager;
            this.isFirstShow = false;
            this.initWidth = 0;
            this.initHeight = 0;
        }

        async init() {
            this.settingPopupShowBtn();
            this.settingPopupCloseBtn();
        }

        settingPopupShowBtn() {
            var self = this;
            var btnEl = document.querySelector('.js-advanced-show-btn');
            btnEl.addEventListener('click', function() {
                var areaEl = document.querySelector('.js-permanent-cache-area');
                areaEl.style.display = 'block';
                if (self.isFirstShow === false) {
                    self.isFirstShow = true;
                    self._backupDialogSize(areaEl);
                }else{
                    self._restoreDialogSize(areaEl);
                }
                self.permanentCacheManager.showEstimateArea();
                self.gaChannel.publish('advanced');
            }, false);
        }
        settingPopupCloseBtn() {
            var btnElList = document.querySelectorAll('.js-permanent-cache-close-btn');
            btnElList.forEach(function(btnEl) {
                btnEl.addEventListener('click', function() {
                    var areaEl = document.querySelector('.js-permanent-cache-area');
                    areaEl.style.display = 'none';
                }, false);
            });
        }

        _backupDialogSize(areaEl) {
            var width = areaEl.getBoundingClientRect().width;
            var height = areaEl.getBoundingClientRect().height;
            this.initWidth = width;
            this.initHeight = height;
        }
        _restoreDialogSize(areaEl) {
            areaEl.style.width = this.initWidth + 'px';
            areaEl.style.height = this.initHeight + 'px';
        }

    };

}(this));
