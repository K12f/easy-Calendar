/**
 * 使用：
 * new EasyCalendar (),
 * 无配置参数，那么渲染一个日历组件
 *
 * 有配置参数，传入data，那么会把这些特殊日期 激活，其他变为灰色
 *
 * 有回调函数，回调函数返回的 属性类名 会加在日期上
 * @constructor
 */
function EasyCalendar() {
	var self = this;

	//当前信息
	var curDate = null;
	var calDate = null;
	var gird = 6 * 7;
	//配置
	var conf = {
		id: "#easyCalendar",
		weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		backMsg:'Back',
		data: [],
		callback: null
	};
	if (typeof self.ajax !== 'function') {
		EasyCalendar.prototype.init = function (configs) {
			if(configs){
				conf.id = configs.id ? configs.id : conf.id;
				conf.weekday = configs.weekday ? configs.weekday : conf.weekday;
				conf.month = configs.month ? configs.month : conf.month;
				conf.backMsg = configs.backMsg ? configs.backMsg : conf.backMsg;
				conf.data = configs.data ? configs.data : conf.data;
				conf.callback = configs.callback ? configs.callback : conf.callback;
			}


			curDate = new Date ();
			calDate = new Date ();
			self.setup ();
		};
		EasyCalendar.prototype.setup = function () {
			var box = document.querySelector (conf.id);
			box.innerHTML = (self.render ());
			var prev = document.querySelector ('.prev');
			var next = document.querySelector ('.next');
			var back = document.querySelector ('.back');
			prev.addEventListener ('click', function () {
				self.prev ();
			});
			next.addEventListener ('click', function () {
				self.next ();
			});
			back.addEventListener ('click', function () {
				self.back ();
			});
		};
		EasyCalendar.prototype.getYear = function () {
			return curDate.getFullYear ();
		};

		EasyCalendar.prototype.setYear = function (year) {
			return curDate.setYear (year);
		};

		EasyCalendar.prototype.getMonth = function () {
			return parseInt (curDate.getMonth ());
		};

		EasyCalendar.prototype.setMonth = function (month) {
			return curDate.setMonth (month)
		};

		//获取当前是星期几
		EasyCalendar.prototype.getDay = function () {
			return curDate.getDay ();
		};

		EasyCalendar.prototype.setDay = function (day) {
			return curDate.setDay (day)
		};

		//获取第一天是星期几
		EasyCalendar.prototype.getFirstDay = function () {
			return new Date (self.getYear (), self.getMonth (), 1).getDay ();
		};

		//获取一个月的天数
		EasyCalendar.prototype.getEndDate = function () {
			return (new Date (self.getYear (), self.getMonth () + 1, 0)).getDate ();
		};

		//获取当前的天数
		EasyCalendar.prototype.getDate = function () {
			return curDate.getDate ();
		};

		//获取当前的秒数
		EasyCalendar.prototype.getTime = function () {
			return curDate.getTime ();
		};

		//
		EasyCalendar.prototype.getCurDate = function (day) {
			if (day < 10) {
				day = '0' + day;
			}
			var month = (self.getMonth () + 1);
			if(month<10){
				month = '0'+month;
			}
			return self.getYear () + '-' + month + '-' + day;
		};

		EasyCalendar.prototype.render = function () {
			var element = "<div class='calendar'>";
			element += "<div class='month'><ul><li class='prev'>❮</li><li class='next'>❯</li><li class='text-center'>" + self.renderMonth () + "</li></ul>";
			element += "<div class='back'><span class='pointer'>"+conf.backMsg+"</span></div></div>";

			element += self.renderWeek ();
			element += "<ul class='days'>" + self.renderDay () + "</ul>";
			element += "</div>";
			return element;
		};

		EasyCalendar.prototype.renderMonth = function () {
			return "<strong class='month-value'>" + conf.month[self.getMonth ()] + "</strong><br /><span class='year'>" + self.getYear () + "</span>";
		};

		EasyCalendar.prototype.renderWeek = function () {
			var element = '<ul class="weekdays">';
			for (var i = 0; i < conf.weekday.length; i++) {
				element += "<li>" + conf.weekday[i] + "</li>";
			}
			element += '</ul>';
			return element;
		};

		EasyCalendar.prototype.renderDay = function () {
			var element = '', len = self.getEndDate (), curDate = calDate.getDate (), nowDate = 0,nowDateTime;
			var firstDay = self.getFirstDay (),defaultClassName='invalid',className='',pClass='day';

			//生成一个7x6的个格子
			for (var j = 0; j < firstDay; j++) {
				element += "<li class="+defaultClassName+"><p class="+pClass+">&nbsp;</p></li>";
			}
			for (var i = 0; i < len; i++) {
				nowDate = (i + 1);
				nowDateTime = self.getCurDate (nowDate);
				//获取当前日期
				// 小于当前时间，灰色
				//年份小于
				//年份等于，月份小
				//年份等于，月份等于，天数小
				if (self.getYear () < calDate.getFullYear () ||
					(self.getYear () === calDate.getFullYear () && self.getMonth () < calDate.getMonth ()) ||
					(self.getYear () === calDate.getFullYear () && self.getMonth () === calDate.getMonth () && nowDate < curDate)
				) {
					element += "<li class="+defaultClassName+"><p class="+pClass+">" + nowDate + "</p></li>";
				} else {
					//其他时间

					className = 'hover';
					//如果时间在data中
					// 1 .普通时间， 2，假日，3 特殊时间
					if (conf.data && conf.data.length > 0) {
						className = conf.callback ? conf.callback (nowDateTime, conf.data) : 0;
					}
					if (calDate.getFullYear () === self.getYear () && calDate.getMonth () === self.getMonth () && curDate === nowDate) {
						//当前时间
						element += "<li class="+ className +" data-time="+nowDateTime+"><p class="+pClass+">Today</p></li>";
					}else {
						element += "<li class="+ className + " data-time="+nowDateTime+"><p>" + nowDate + "</p></li>";
					}

				}
			}
			for (var m = 0; m < gird - firstDay - len; m++) {
				element += "<li class="+defaultClassName+"><p class="+pClass+">&nbsp;</p></li>";
			}
			return element;
		};

		EasyCalendar.prototype.prev = function () {
			self.setMonth (self.getMonth () - 1);
			self.setup ();
		};

		EasyCalendar.prototype.next = function () {
			self.setMonth (self.getMonth () + 1);
			self.setup ();
		};

		EasyCalendar.prototype.back = function () {
			if (calDate.getTime () === self.getTime ()) {
				return;
			}
			self.setYear (calDate.getFullYear ());
			self.setMonth (calDate.getMonth ());
			self.setup ();
		};
		//TODO 获取接口是否是假日之类
		EasyCalendar.prototype.get = function () {
		};
	}
}