define('mods/pc/taskList', function(require, exports, module) {
    var $mustache = require('lib/mustache/mustache');
    // 用户信息
    var $UserInfo = require('comp/userInfo');
    // 请求域名
    var $globalVars = require('mods/global/vars');
    // 调用数字滚动效果
    // var countUp = require('comp/countUp');

    // list模版
    var TaskListObj = {
        // 显示完成资料按钮下的二维码
        _qrShowAction: function() {
            var mobileQrNode = this.taskList.find('[data-role="mobile"]');
            mobileQrNode.hover(function(e) {
                e.stopPropagation();
                var self = $(this);
                self.next().show();
            }, function(e) {
                var self = $(this);
                e.stopPropagation();
                self.next().hide();
            });
        },
        // 渲染模版
        _renderTaskList: function(res) {
            // var _this = this;
            var firstElement;
            $.each(res, function(keyEle, itemEle) {
                if (itemEle.id == '1') {
                    firstElement = res.shift();
                    return false;
                }
            });
            if (firstElement) {
                res.push(firstElement);
            }
            var listData = {};
            $.each(res, function(key, item) {
                var stepList = item.step.split('\t');
                var creditList = item.credit.split('\t');
                var csc = Number(item.csc);
                var stepCurr;
                // item.href = 'javascript:;';
                // 阶段分母
                item.total = stepList[0];
                // 阶段分子
                item.stage = 0;
                // 阶段奖励
                item.reward = creditList[0];
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
                    // item.href = 'javascript:;';
                } else if (item.id == '1') {
                    // item.href = 'http://i.le.com/setting';
                    item.btnContent = '手机专享';
                    item.dataRole = "mobile";
                    item.mobileFlag = true;
                }

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
                    if (code == 0) {
                        if ($.isArray(res.data) && callback) {
                            callback(res.data.slice(0, 2));
                        } else {
                            return;
                        }
                    } else {
                        return;
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
            receiveBtn.on('click', function() {
                if (_this.receiveLock) {
                    return;
                }
                _this.receiveLock = true;
                var taskId = $(this).next().val();
                // var lemiNumber = _this.lemiNode.html();
                // var lemiReward = $(this).next().next().val();
                // var lemiTotal, demo;
                $.ajax({
                    url: $globalVars.apiDomain + '/Task/Index/getRecord/type/0/id/' + taskId,
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(res) {
                        var code = res.ret;
                        if (code == 0) {
                            // lemiTotal = Number(lemiNumber) + Number(lemiReward);
                            // demo = new countUp('lemiCount', lemiNumber, lemiTotal, 0, 2);
                            // demo.start();
                            alert('领取成功');
                            window.location.reload();
                        } else {
                            return;
                        }
                    },
                    complete: function() {
                        _this.receiveLock = false;
                    },
                    error: function() {
                        return;
                    }
                });
            });
        },
        _initDom: function() {
            // 任务模块
            this.taskNode = $('#pl-task');
            // 任务列表
            this.taskList = this.taskNode.find('[data-role="list"]');
            // 获取乐米数量
            this.headNode = $('#sign-info');
            //
            this.lemiNode = this.headNode.find('[data-role="text-points"]');


        },
        // 任务入口
        _initVars: function() {
            // 任务模版
            this.taskTpl = [
                '{{#res}}',
                '<div class="item">',
                '<div class="task_name">{{title}}</div>',
                '<div class="progress">',
                '<span class="benifit"><i class="icon_sn icon_sn_mit"></i><i class="gold">{{reward}}</i></span>',
                '<div class="bar"><span style="width: {{percent}};"></span></div>',
                '<div class="pct">{{stage}}/{{total}}</div>',
                '</div>',
                '{{^receiveFlag}}',
                '<a {{^achieveFlag}}style="cursor:default;"{{/achieveFlag}} href="javascript:;" class="task_btn task_get {{#achieveFlag}}task_mi{{/achieveFlag}}" data-role="{{dataRole}}">{{btnContent}}</a>',
                '{{#mobileFlag}}',
                '<div class="item_qr" style="display: none;">',
                '<img src="http://i1.letvimg.com/lc04_iscms/201704/13/10/38/4a1ee8b6392843a4b7e5cb663c5d17f1.gif"><span>扫码完成任务</span>',
                '</div>',
                '{{/mobileFlag}}',
                '{{#achieveFlag}}',
                '<input class="hide" value="{{id}}"/>',
                '<input class="hide" value="{{reward}}"/>',
                '{{/achieveFlag}}',
                '{{/receiveFlag}}',
                '{{#receiveFlag}}',
                '<span class="task_sucess"></span>',
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
                    _this._qrShowAction();
                });
            });

        }
    };

    module.exports = TaskListObj;
});
