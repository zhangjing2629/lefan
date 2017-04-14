define('mods/mobile/taskList', function(require, exports, module) {
    var $mustache = require('lib/mustache/mustache');
    // 用户信息
    var $UserInfo = require('comp/userInfo');
    // 请求域名
    var $globalVars = require('mods/global/vars');
    // list模版
    var TaskListObj = {
        // 点击箭头出现与消失
        _taskListShow: function(btn, className) {
            var _this = this;
            this.btn.on('click', function() {
                var self = $(this);
                self.toggleClass('toggle_up');
                _this.taskList.toggle();
            });
        },
        // 渲染模版
        _renderTaskList: function(res) {
            // var _this = this;
            var listData = {};
            $.each(res, function(key, item) {
                var stepList = [],
                    creditList = [];
                if (item.step) {
                    stepList = item.step.split('\t');
                    // 阶段分母
                    item.total = stepList[0];
                }
                if (item.credit) {
                    creditList = item.credit.split('\t');
                    // 阶段奖励
                    item.reward = creditList[0];
                }
                var csc = Number(item.csc);
                var stepCurr;
                item.href = 'javascript:;';
                // 阶段分子
                item.stage = 0;

                // 按钮文案
                item.btnContent = '进行中';
                // 是否完成任务
                item.receiveFlag = false;
                // 是否领取
                item.achieveFlag = false;
                if (item.available == '2' && item.csc) {
                    $.each(stepList, function(keyStep, itemStep) {
                        stepCurr = Number(itemStep);
                        // 可以领奖，且没有
                        if (csc == stepCurr && item.status == keyStep) { // 完成当前阶段
                            item.dataRole = 'task-receive';
                            item.btnContent = '领乐米';
                            item.reward = creditList[keyStep];
                            item.total = stepList[keyStep];
                            item.achieveFlag = true;
                            return false;
                        } else if (csc >= stepList[stepList.length - 1] && (item.status == "3" || item.status == "1")) { // 完成所有阶段
                            item.reward = creditList[stepList.length - 1];
                            item.total = stepList[stepList.length - 1];
                            item.receiveFlag = true;
                            return false;
                        } else if (csc == stepCurr && item.status > keyStep) { // 领取完上一阶段
                            item.reward = creditList[keyStep + 1];
                            item.total = stepList[keyStep + 1];
                            return false;
                        } else if (csc > stepCurr && item.status < keyStep) { // 完成上一阶段，且未完成下一阶段
                            item.reward = creditList[keyStep];
                            item.total = stepList[keyStep];
                            return false;
                        } else if (csc < stepCurr && item.status == keyStep) { // 未完成当前阶段
                            item.reward = creditList[keyStep];
                            item.total = stepList[keyStep];
                            return false;
                        }
                    });
                    item.stage = csc;
                    item.href = 'javascript:;';
                } else if (item.id == '1') {
                    item.href = '/sign/userinfo.html';
                    item.dataRole = 'toAchieve';
                    item.btnContent = '去完成';
                    item.achieveFlag = true;
                }
                // if (csc >= stepList[stepList.length - 1] && item.status == "1") {
                //     item.reward = creditList[stepList.length - 1];
                //     item.total = stepList[stepList.length - 1];
                //     item.receiveFlag = true;
                // }

                // 百分比
                item.percent = (item.stage / item.total) * 100 + '%';

                if ((item.stage / item.total) >= 1) {
                    item.percent = 1 * 100 + '%';
                }
            });
            listData.res = res;
            var html = '';
            html = $mustache.render(this.taskTpl, listData);
            this.taskList.append(html);
        },
        // 请求任务接口
        _reqTaskApi: function(callback) {
            $.ajax({
                url: $globalVars.apiDomain + '/Task/Index/tasks/type/0/uid/' + $UserInfo.ssouid,
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    var data = res.data;
                    if (code == 0 && $.isArray(data) && callback) {
                        callback(data);
                    }
                },
                error: function() {
                    return;
                }
            });
        },
        // 完成任务领乐迷接口
        _receiveTaskApi: function() {
            var _this = this;
            var receiveBtn = this.taskNode.find('[data-role="task-receive"]');
            receiveBtn.on('tap', function() {
                if (_this.receiveLock) {
                    return;
                }
                _this.receiveLock = true;
                var taskId = $(this).next().val();
                $.ajax({
                    url: $globalVars.apiDomain + '/Task/Index/getRecord/type/0/id/' + taskId,
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(res) {
                        var code = res.ret;
                        if (code == 0) {
                            alert('领取成功');
                            window.location.reload();
                        } else {
                            alert('乐米走失了，请刷新重新领取。');
                        }
                    },
                    complete: function() {
                        _this.receiveLock = false;
                    },
                    error: function() {
                        alert('乐米走失了，请刷新重新领取。');
                    }
                });
            });
        },
        _initDom: function() {
            // 任务模块
            this.taskNode = $('#pl-task');
            // 箭头节点
            this.btn = this.taskNode.find('[data-role="btn-toggle"]');
            // 任务列表
            this.taskList = this.taskNode.find('[data-role="list"]');
        },
        // 任务入口
        _initVars: function() {
            // 任务模版
            this.taskTpl = [
                '{{#res}}',
                '<div class="item C_item">',
                '<div class="item_tl">{{title}}</div>',
                '<div class="progress">',
                '<div class="benefit">',
                '<i class="icon_mi"></i><i>{{reward}}</i>',
                '</div>',
                '<div class="bar"><i style="width:{{percent}}"></i></div>',
                '<div class="step">{{stage}}/{{total}}</div>',
                '</div>',
                '{{^receiveFlag}}',
                '<a href="{{href}}" class="op btn_get {{#achieveFlag}}btn_mi{{/achieveFlag}}" data-role="{{dataRole}}">{{btnContent}}</a>',
                '<input class="hide" value="{{id}}"/>',
                '{{/receiveFlag}}',
                '{{#receiveFlag}}',
                '<span class="op icon_sucess"></span>',
                '{{/receiveFlag}}',
                // '<span class="channel">手机专享</span>',
                '</div>',
                '{{/res}}'
            ].join('');
            // 完成任务领取锁
            this.receiveLock = false;
        },
        init: function() {
            var _this = this;
            this._initVars();
            this._initDom();
            this._reqTaskApi(function(data) {
                _this._reqTaskApi(function(data) {
                    _this._renderTaskList(data);
                    _this._receiveTaskApi();
                });
            });
            this._taskListShow();

        }
    };

    module.exports = TaskListObj;
});
