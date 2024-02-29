function AddFavorite(url, title) {
	try {
		if (document.all) {
			window.external.AddFavorite(url, title);
		} else if (window.sidebar && window.sidebar.addPanel) {
			window.sidebar.addPanel(title, url, "");
		} else if (window.external) {
			window.external.AddFavorite(url, title);
		} else if (window.opera && window.print) {
			return true;
		}
	} catch (e) {
		alert("浏览器加入收藏提示：\n请使用Ctrl+D进行添加！");
	}
}

function easytooltip(index) {
	var list = ['复制成功', '复制失败'];
	//var lists = Math.floor(Math.random() * list.length);
	//var colors = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
	var colors = '#000000';
	var $i = $('<span class="animate" />').text(list[index]);
	var xx = event.pageX || event.clientX + document.body.scroolLeft;
	var yy = event.pageY || event.clientY + document.body.scrollTop;

	$('body').append($i);
	$i.css({
		top: yy,
		left: xx,
		color: colors,
		transform: 'translate(-50%, -50%)',
		display: 'block',
		position: 'absolute',
		zIndex: 999999999999
	})
	$i.animate({
		top: yy,
		opacity: .5
	}, 3000, function() {
		$i.remove();
	})
}
/**
 * 一键粘贴
 * @param  {String} id [需要粘贴的内容]
 * @param  {String} attr [需要 copy 的属性，默认是 innerText，主要用途例如赋值 a 标签上的 href 链接]
 *
 * range + selection
 *
 * 1.创建一个 range
 * 2.把内容放入 range
 * 3.把 range 放入 selection
 *
 * 注意：参数 attr 不能是自定义属性
 * 注意：对于 user-select: none 的元素无效
 * 注意：当 id 为 false 且 attr 不会空，会直接复制 attr 的内容
 */
function copy(id, attr) {
	let target = null;

	if (attr) {
		target = document.createElement('div');
		target.id = 'tempTarget';
		target.style.opacity = '0';
		if (id) {
			let curNode = document.querySelector('#' + id);
			target.innerText = curNode[attr];

		} else {
			target.innerText = attr;
		}
		document.body.appendChild(target);
	} else {
		target = document.querySelector('#' + id);
	}

	try {
		let range = document.createRange();
		range.selectNode(target);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		document.execCommand('copy');
		window.getSelection().removeAllRanges();
		console.log('复制成功')
		easytooltip(0)
	} catch (e) {
		console.log('复制失败')
		easytooltip(1)
	}

	if (attr) {
		// remove temp target
		target.parentElement.removeChild(target);
	}
}
/**tools function*/
/**
 * [numFomat 数字格式化（金额）]
 * @param {string/number} num [金额或手机号码]
 * @param {string} sep [分隔符]
 * @return {string} [转换后的数值]
 */
function toThousands(num, sep) {
	var dot;
	num += '';
	if (num.indexOf('.') > 0) {
		// 带小数（金额）
		dot = num.substr(num.indexOf('.'));
		num = num.substr(0, num.indexOf('.'));
	}
	num = num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + sep);
	if (dot) {
		num += dot;
	}
	return num;
}


function aalert(message) {
	var fn = eval("swal");
	if (typeof(fn) === 'function') {
		swal(message);
	} else {
		alert(message)
	}
}


function iframeAutoFit(iframeObj){ 
    var ifm= document.getElementById(iframeObj); 
        ifm.height=document.documentElement.clientHeight;
}