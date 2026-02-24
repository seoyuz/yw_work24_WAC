let scrollPosition; // 스크롤 위치

function lnbBtnPositionSet(){
    if($('.container').hasClass('lnb-collapsed')){
        $('.btn-lnb').css('left', (Number($('.lnb').offset().left) * -1) + 'px');
    } else{
        $('.btn-lnb').css('left', '');
    }
}

function checkFooterInView() {
    var windowBottom = $(window).scrollTop() + $(window).height();
    var footerTop = $('.footer').offset().top;
    var scrollTopBtn = $('.btn-top');
    var viewportWidth = window.innerWidth || $(window).width();

    if($(window).scrollTop() > 300){
        scrollTopBtn.stop().fadeIn(100);
    } else{
        scrollTopBtn.stop().fadeOut(100);
    }

    if(viewportWidth > 768){
        if (windowBottom >= footerTop) {
            scrollTopBtn.addClass('is-fixed');
        } else {
            scrollTopBtn.removeClass('is-fixed');
        }
    } else{
        if (windowBottom >= footerTop + 92) {
            scrollTopBtn.addClass('is-fixed');
        } else {
            scrollTopBtn.removeClass('is-fixed');
        }
    }
}

function openPopup(popupSelector, triggerElement) {
    const $popup = $(popupSelector);
    const $focusableElements = $popup.find('a:not(:disabled), button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), details, [tabindex]:not([tabindex="-1"])');
    const $firstFocusableElement = $focusableElements.first();
    const $lastFocusableElement = $focusableElements.last();
    /*
        웹접근성 점검내용 보완 i_vha 2025-02-05
        팝업 열기 전 현재 focus된 요소 찾기
    */
    var _triggerElement = ".skip-nav";   //default 페이지 최상단 요소
    if($(":focus").length == 1){
        _triggerElement = $(":focus");
    }
    else if(!(typeof triggerElement == "undefined" || triggerElement == undefined || triggerElement == "")){
        _triggerElement = triggerElement;
    }

    // 팝업 열기
    $popup.show();
    $popup.attr('aria-hidden', 'false');

    // 현재 스크롤 위치 저장
    scrollPosition = $(window).scrollTop();
    $(window).off("scroll").scroll(function(e){
        $(window).scrollTop(scrollPosition);
    });
    $('body').css({
          'overflow': 'hidden',
          'position': 'fixed',
          'top': -scrollPosition + 'px',
          'width': '100%'
      });


    // 포커스 설정
    setTimeout(function(){$popup.find('.popup-wrap').attr('tabindex', '-1').focus();}, 100);    //강제 포커싱을 위해 setTimeout i_vha 2025-02-05

    // 팝업 컨테이너에 키다운 이벤트 리스너 추가
    $popup.on('keydown', function(e) {
        const focusableCount = $focusableElements.length;
        const focusedElement = $(document.activeElement);

        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (focusedElement.is($firstFocusableElement) || focusedElement.is('.popup-wrap')) {
                    e.preventDefault();
                    $lastFocusableElement.focus();
                }
            } else { // Tab
                if (focusedElement.is($lastFocusableElement)) {
                    e.preventDefault();
                    $firstFocusableElement.focus();
                }
            }
        }
    });

    // 팝업 닫기 버튼
    $popup.find('.popup-close').on('click', function() {
        closePopup(popupSelector, _triggerElement);
    });
}

function closePopup(popupSelector, triggerElement) {
    const $popup = $(popupSelector);

    // 팝업 닫기
    $popup.hide();
    $popup.attr('aria-hidden', 'true');

    // 이전 스크롤 위치 복원
    $('body').css({
        'overflow': '',
        'position': '',
        'top': '',
        'width': ''
    });
    $(window).scrollTop(scrollPosition);
    $(window).off("scroll").scroll(function(){
        if($('.footer').length > 0) checkFooterInView();
    });

    // 트리거 요소로 포커스 복귀
    if (triggerElement) {
        var tidxYn = false;
        if(typeof $(triggerElement).attr("tabindex") == "undefined"){
            tidxYn = true;
            $(triggerElement).attr("tabindex", "-1");
        }
        setTimeout(function(){
            $(triggerElement).focus();
            if(tidxYn){
                $(triggerElement).removeAttr("tabindex");
            }
        }, 100);    //강제 포커싱을 위해 setTimeout i_vha 2025-02-05
    }
}

// spinner, blockUI 켜기
function onSpinBlockUI(){
    if(!(typeof ComLib.blockUI == "undefined" || ComLib.blockUI == undefined) && typeof ComLib.blockUI == "function"){
        ComLib.blockUI();
    }
    if(!(typeof spin == "undefined" || spin == undefined) && $("#spin").length > 0){
        spin.spin($("#spin")[0]);
    }
    setTimeout(function(){
        offSpinBlockUI();
    }, 3000);
}
// spinner, blockUI 끄기
function offSpinBlockUI(){
    if(!(typeof spin == "undefined" || spin == undefined) && $("#spin").length > 0){
        spin.stop();
    }
    if(!(typeof ComLib.unblockUI == "undefined" || ComLib.unblockUI == undefined) && typeof ComLib.unblockUI == "function"){
        ComLib.unblockUI();
    }
}


$(function(){
    // SKIP NAVI =====================================================================
    $('.skip-nav a').on('click',function(){
        var href = $(this).attr('href');

        $(href).attr('tabindex', 0).on('blur focusout', function () {
            $(this).removeAttr('tabindex');
        }).focus();
    })
    $('.skip-nav > a:first-child').on('click', function(){
        $('html, body').animate({ scrollTop: 0 }, '0');
    })

	//2025.10.01 (로그인 전) 메인 페이지 바로가기 링크 적용
    $('.skip-nav-main a').on('click',function(){
        var href = $(this).attr('href');

        $(href).attr('tabindex', 0).on('blur focusout', function () {
            $(this).removeAttr('tabindex');
        }).focus();

		var targetTop = $(href).offset().top - 500;

        $('html, body').animate({ scrollTop:  targetTop }, 100);

    })


    // HEADER =====================================================================
	// 2025.10.02 웹 편의성 조치
	// 사이트에 접속하는 사용자 중 터치스크린으로 접근하는 사용자와 같이 일부 사용자에게는 마우스 오버 인터렉션이 작동하지 않고,
	// 작은 메뉴 링크 영역에 일정 시간 마우스의 위치를 고정하는 상호작용이 어려운 사용자가 있을 수 있기 때문에
	// 드롭다운 목록은 반드시 클릭 혹은 키보드 탐색을 통해 이루어져야 합니다.

/*   $('.gnb, .gnb-bg').on({
        'mouseenter' : function(){
            $('.header-bottom').addClass('is-expanded');
        },
        'mouseleave' : function(){
            $('.header-bottom').removeClass('is-expanded');
        },
    });
    $('.gnb a').on('focus', function(){
        $('.header-bottom').addClass('is-expanded');
    })
    $('.gnb').on('focusout', function(){
        setTimeout(function(){
            if(!$('.gnb').find('a:focus').length){
                $('.header-bottom').removeClass('is-expanded');
            }
        }, 0)
    });
*/
	// 2025.10.02 웹 편의성 조치  드롭다운 목록은 반드시 클릭 혹은 키보드 탐색을 통해 이루어져야 합니다.
	var clickCount = false;

	$('.header-bottom .gnb > ul > li > a').on({ 
        /* 260223 웹접근성  - 선택자변경 (yz) :
            $('.header-bottom .gnb a') -> $('.header-bottom .gnb > ul > li > a')
        */
		'click': function() {
			if (clickCount == true) {
				/*
					2025.10.02 웹 편의성 조치 :
					접기/펼치기 기능을 하는 링크를 제공하고 있으나 접기/펼치기 상태에 따른 상태 정보를
					제공하지 않아 화면 낭독기 사용자는 현재 상태를 인지할 수 없습니다.
					링크에 숨김 텍스트, aria-expanded="true | false", title 속성 등을 이용하여
					접기/펼치기 상태에 따른 상태 정보를 제공
				*/
				$('.header-bottom').removeClass('is-expanded');
				$(this).attr("aria-expanded", false); //2025.10.02 웹 접근성 조치
				$(this).closest('li').siblings('li').children('a').attr("aria-expanded", false);
                /* 260223 웹접근성  - 선택자변경 (yz) :
                    .find('a') -> .children('a')
                */

				/* 2025.10.02 웹 접근성 조치 :
				   선택 여부를 색상으로만 구분하고 있어 색을 인지하기 어려운 저시력, 시각 장애인은 링크의 선택 여부를 인지할 수 없습니다.
 				   크기, 모양, 명암(7:1 이상), 모양, 패턴, 외곽선 등으로 구분하여 색을 배제하여도 콘텐츠를 인지할 수 있도록 제공해야 합니다
				*/
				$(this).closest('li').removeClass('over'); //2025.10.02 웹 접근성 조치
				$(this).closest('li').removeClass('selected'); //2025.10.02 웹 접근성 조치
				$(this).closest('li').siblings('li').removeClass("over"); //2025.10.02 웹 접근성 조치
				$(this).closest('li').siblings('li').removeClass("selected"); //2025.10.02 웹 접근성 조치

				clickCount = false;
			} else {
				/* 2025.10.02 웹 편의성 조치 :
				   접기/펼치기 기능을 하는 링크를 제공하고 있으나 접기/펼치기 상태에 따른 상태 정보를
				   제공하지 않아 화면 낭독기 사용자는 현재 상태를 인지할 수 없습니다.
				   링크에 숨김 텍스트, aria-expanded="true | false", title 속성 등을 이용하여
				   접기/펼치기 상태에 따른 상태 정보를 제공
				*/
				$('.header-bottom').addClass('is-expanded');
				$(this).attr("aria-expanded", true); //2025.10.02 웹 접근성 조치
				/* 2025.10.02 웹 접근성 조치 :
				   선택 여부를 색상으로만 구분하고 있어 색을 인지하기 어려운 저시력, 시각 장애인은 링크의 선택 여부를 인지할 수 없습니다.
 				   크기, 모양, 명암(7:1 이상), 모양, 패턴, 외곽선 등으로 구분하여 색을 배제하여도 콘텐츠를 인지할 수 있도록 제공해야 합니다
				*/
				$(this).closest('li').addClass('over'); //2025.10.02 웹 접근성 조치
				$(this).closest('li').addClass('selected'); //2025.10.02 웹 접근성 조치
				clickCount = true;
			}
		},
	});

	/* 2025.10.02 웹 편의성 조치 :
		접기/펼치기 기능을 하는 링크를 제공하고 있으나 접기/펼치기 상태에 따른 상태 정보를
		제공하지 않아 화면 낭독기 사용자는 현재 상태를 인지할 수 없습니다.
 		링크에 숨김 텍스트, aria-expanded="true | false", title 속성 등을 이용하여 접기/펼치기 상태에 따른 상태 정보를 제공
	*/
	$('.header-bottom .gnb').on('focusout', function() {
		setTimeout(function() {
			if (!$('.gnb').find('a:focus').length) {
				$('.header-bottom').removeClass('is-expanded');

				$('.gnb a').each(function() {
					$('.header-bottom .gnb > ul > li > a').attr("aria-expanded", false);
                    /* 260223 웹접근성  - 선택자변경 (yz) :
                        $('.gnb a') -> $('.header-bottom .gnb > ul > li > a')
                    */

					/* 2025.10.02 웹 접근성 조치 :
					   선택 여부를 색상으로만 구분하고 있어 색을 인지하기 어려운 저시력, 시각 장애인은 링크의 선택 여부를 인지할 수 없습니다.
	 				   크기, 모양, 명암(7:1 이상), 모양, 패턴, 외곽선 등으로 구분하여 색을 배제하여도 콘텐츠를 인지할 수 있도록 제공해야 합니다
					*/
					$('.gnb a').closest('li').removeClass('over');
					$('.gnb a').closest('li').removeClass('selected');

					clickCount = false;
				})
			}
		}, 0)
	});

    $('.header-bottom .gnb > ul > li').on({
        'mouseenter' : function(){
            $(this).addClass('over');
        },
        'mouseleave' : function(){
            $(this).removeClass('over');
        },
    })
    $('.header-bottom .gnb > ul > li a').on({
        'focus' : function(){
      		$(this).closest('li').siblings('li').removeClass("over");
            $(this).closest('li').addClass('over');
        },
    })

    // MOB =====================================================================
    $('.header .btn-menu.mob').on('click', function(){
        if(!$('.header').hasClass('is-expanded')){

            scrollPosition = $(window).scrollTop();  // 현재 스크롤 위치 저장
            $('body').css({
                'overflow': 'hidden',
                'position': 'fixed',
                'top': -scrollPosition + 'px',
                'width': '100%'
            });

            $('.header').addClass('is-expanded');
            $(this).find('.blind').text('메뉴닫기');
            //2025.10.02 웹 접근성 조치 : 버튼 클릭 시 펴진 것에 대한 aria 추가
            $('.mob-menu .gnb > ul > li.depth').each(function() {
				if($(this).hasClass('is-expanded')){
					$(this).children('a').attr("aria-expanded", true);
				}
			})
			/*
				2025.10.02 웹 접근성 조치 :
				현재 선택 여부를 시각적으로만 구분하고 있어 화면 낭독기 사용자는 선택 여부를 인지할 수 없습니다.
				숨김 텍스트, title, aria-current="page" 등을 이용하여 선택 여부에 따른 선택 정보를 제공
			*/
			$('.mob-menu .gnb ul > li.depth > ul > li > a').each(function(){
				if($(this).parent("li").hasClass("on")){
			        $(this).attr("aria-current", "page"); //2025.10.02 웹 접근성 조치
				}else{
			        $(this).removeAttr("aria-current"); //2025.10.02 웹 접근성 조치
			    }
		        if($(this).parent("li").hasClass('is-expanded')){
		            $(this).attr('aria-expanded', true); //2025.10.02 웹 접근성 조치
		        }
		    });

        } else{

            $('body').css({
                'overflow': '',
                'position': '',
                'top': '',
                'width': ''
            });
            $(window).scrollTop(scrollPosition);  // 이전 스크롤 위치 복원

            $('.header').removeClass('is-expanded');
            $(this).find('.blind').text('메뉴열기');

			/* 2025.10.02 웹 편의성 조치 :
			   접기/펼치기 기능을 하는 링크를 제공하고 있으나 접기/펼치기 상태에 따른 상태 정보를
			   제공하지 않아 화면 낭독기 사용자는 현재 상태를 인지할 수 없습니다.
 			   링크에 숨김 텍스트, aria-expanded="true | false", title 속성 등을 이용하여 접기/펼치기 상태에 따른 상태 정보를 제공
			*/
           	$('.mob-menu .gnb > ul > li.depth').each(function() {
				$(this).children('a').attr("aria-expanded", false);
			})
        }
    })

    $('.mob-menu .gnb > ul > li.depth > a, .mob-menu .gnb ul > li.depth > a').on('click', function(e){
        e.preventDefault();

		if (!$(this).closest('li').hasClass('is-expanded')) {
			$(this).closest('li').siblings('li').removeClass('is-expanded');
			$(this).closest('li').addClass('is-expanded');

			/* 2025.10.02 웹 편의성 조치 :
			   접기/펼치기 기능을 하는 링크를 제공하고 있으나 접기/펼치기 상태에 따른 상태 정보를
			   제공하지 않아 화면 낭독기 사용자는 현재 상태를 인지할 수 없습니다.
 			   링크에 숨김 텍스트, aria-expanded="true | false", title 속성 등을 이용하여 접기/펼치기 상태에 따른 상태 정보를 제공
			*/
			$(this).closest('li').siblings('li.depth').children('a').attr("aria-expanded", false);
			$(this).attr("aria-expanded", true); //2025.10.12 웹 접근성 조치
		}
    });

    // LNB =====================================================================
    $('.btn-lnb').on('click', function(){
        if(!$('.container').hasClass('lnb-collapsed')){
            $('.container').addClass('lnb-collapsed');
            $(this).find('.blind').text('메뉴열기');
        } else{
            $('.container').removeClass('lnb-collapsed');
            $(this).find('.blind').text('메뉴닫기');
        }

        lnbBtnPositionSet()
    });

	/*2025.10.02 웹 접근성 조치 :
	* 1) 현재 선택 여부를 시각적으로만 구분하고 있어 화면 낭독기 사용자는 선택 여부를  인지할 수 없습니다.
 	* 숨김 텍스트, title, aria-current="page" 등을 이용하여 선택 여부에 따른 선택 정보를 제공해야 합니다.
 	* 2) 접기/펼치기 기능을 하는 링크를 제공하고 있으나 접기/펼치기 상태에 따른 상태 정보를 제공하지 않아 화면 낭독기 사용자는 현재 상태를 인지할 수 없습니다.
 	* 링크에 숨김 텍스트, aria-expanded="true | false", title 속성 등을 이용하여 접기/펼치기 상태에 따른 상태 정보를 제공해야 합니다.
	*/
    $('.lnb ul > li > a').each(function(){
		if($(this).parent("li").hasClass("on")){
	        $(this).attr("aria-current", "page"); //2025.10.02 웹 접근성 조치
		}else{
	        $(this).removeAttr("aria-current"); //2025.10.02 웹 접근성 조치
	    }
        if($(this).parent("li").hasClass('is-expanded')){
            $(this).attr('aria-expanded', true); //2025.10.02 웹 접근성 조치
        }
    });

    $('.lnb ul > li > a').on('focus', function(){
		if($(this).parent("li").hasClass("on")){
	        $(this).attr("aria-current", "page"); //2025.10.02 웹 접근성 조치
		}else{
	        $(this).removeAttr("aria-current"); //2025.10.02 웹 접근성 조치
	    }
    });

    $('.lnb ul > li.depth > a').on(
	'click', function(e){
        e.preventDefault();

        if(!$(this).closest('li').hasClass('is-expanded')){
            $(this).closest('li').siblings('li').removeClass('is-expanded');
            $(this).closest('li').addClass('is-expanded');
        } else{
            $(this).closest('li.depth').removeClass('is-expanded');
        }
        /* 2025.10.02 웹 편의성 조치 :
		   접기/펼치기 기능을 하는 링크를 제공하고 있으나 접기/펼치기 상태에 따른 상태 정보를
		   제공하지 않아 화면 낭독기 사용자는 현재 상태를 인지할 수 없습니다.
 		   링크에 숨김 텍스트, aria-expanded="true | false", title 속성 등을 이용하여 접기/펼치기 상태에 따른 상태 정보를 제공
		*/
        if($(this).parent("li").hasClass('is-expanded')){
            $(this).attr('aria-expanded', true);
        } else{
            $(this).attr('aria-expanded', false);
        }

        $('.lnb .wrap').css('height', $('.lnb nav').outerHeight(true));
    })

    // FOOTER =====================================================================
    /* 2025.10.02 웹 접근성 조치 : 버튼에 숨김 텍스트,
       aria-expanded="true | false", title 속성 등을 이용하여 접기/펼치기 상태에 따른 상태 정보를 제공해야 합니다. */

	//2025.10.02 웹 접근성 조치
	$('.family-site > button').each(function(){
        if(!$(this).parents('.family-site').hasClass('is-expanded')){
            $(this).attr('aria-expanded', false);
        }
    })

    $('.family-site > button').on('click', function(){
        if(!$(this).parents('.family-site').hasClass('is-expanded')){
            $(this).parents('.family-site').addClass('is-expanded');
            //2025.10.02 웹 접근성 조치
            $(this).attr('aria-expanded', true);
        } else{
            $(this).parents('.family-site').removeClass('is-expanded');
            //2025.10.02 웹 접근성 조치
            $(this).attr('aria-expanded', false);
        }
    })

    $('.btn-top').on('click', function(){
        $('html, body').animate({ scrollTop: 0 }, 'smooth');
    })


    // SHOW/HIDE TOGGLE =====================================================================
    const expandedTxt = '닫기', collapsedTxt = '열기';

    $('[data-show-target]').each(function(){
        const $target = $(this);
        const buttonVal = $target.data('show-target');

        if(!$target.is(':visible') || !$target.hasClass('is-expanded')){ // 숨김영역 HIDE인 경우
            $target.attr('aria-expanded', false);

            $('[data-show-button="' + buttonVal + '"]').each(function(){
                if(!$(this).find('.blind').length && !$(this).parent('.btn-toggle').length){
                    $(this).append('<span class="blind">' + collapsedTxt + '</span>');
                }
            });
        } else { // 숨김영역 SHOW인 경우
            $target.css('display', '').addClass('is-expanded').attr('aria-expanded', true);

            $('[data-show-button="' + buttonVal + '"]').each(function(){
                if(!$(this).find('.blind').length && !$(this).parent('.btn-toggle').length){
                    $(this).append('<span class="blind">' + expandedTxt + '</span>');
                }
            });
        }
    });

    $('[data-show-button]').on('click', function(e){
        e.preventDefault();

        var $button = $(this);
        var targetVal = $button.data('show-button');
        var $target = $('[data-show-target="' + targetVal + '"]');

        if(!$target.hasClass('is-expanded')) { // 숨김영역 HIDE인 경우
            showTarget($target, $button);
        } else { // 숨김영역 SHOW인 경우
            hideTarget($target, $button);
        }

        if($button.hasClass('btn-close')){
      		$(this).find('.blind').text('닫기');
            $('[data-show-button="' + targetVal + '"]').focus();
        }
    });

    function showTarget($target, $button) {
        $target.addClass('is-expanded').attr('aria-expanded', true);
        $button.addClass('is-expanded');

        if($button.parent('.btn-toggle').length) { // 검색조건 더보기 버튼인 경우
            $('.btn-toggle.m-hidden button').text('더 많은 검색조건 닫기')
            $('.btn-toggle.p-hidden button').text('검색조건 닫기');
        } else { // 그 외 버튼
            $button.find('.blind').text(expandedTxt);
        }
    }

    function hideTarget($target, $button) {
        $target.removeClass('is-expanded').attr('aria-expanded', false);
        $button.removeClass('is-expanded');

        if($button.parent('.btn-toggle').length) { // 검색조건 더보기 버튼인 경우
            $('.btn-toggle.m-hidden button').text('더 많은 검색조건 열기')
            $('.btn-toggle.p-hidden button').text('검색조건 열기');
        } else { // 그 외 버튼
            $button.find('.blind').text(collapsedTxt);
        }
    }

    // TAB LAYOUT ======================================================================
    $('.tab-container').each(function() {
        var $tabContainer = $(this);
        var $tabs = $tabContainer.find('[role="tab"]');
        var $tabPanels = $tabContainer.find('[role="tabpanel"]');

        $tabs.on('click', function() {
            var $currentTab = $(this);

            $tabs.attr('aria-selected', 'false');

            $tabPanels.attr('aria-hidden', 'true');

            $currentTab.attr('aria-selected', 'true');
            var panelId = $currentTab.attr('aria-controls');
            $tabContainer.find('#' + panelId).attr('aria-hidden', 'false');
        });

        // 키보드 내비게이션 이벤트 핸들러 설정
        $tabs.on('keydown', function(e) {
            var keyCode = e.keyCode || e.which;
            var $currentTab = $(this);
            var $newTab;

            if (keyCode === 37) {
                $newTab = $currentTab.prev('[role="tab"]');
                if ($newTab.length === 0) {
                    $newTab = $tabs.last();
                }
            }
            else if (keyCode === 39) {
                $newTab = $currentTab.next('[role="tab"]');
                if ($newTab.length === 0) {
                    $newTab = $tabs.first();
                }
            }

            if ($newTab) {
                $newTab.focus().click();
            }
        });
    });

    // FORM ======================================================================

    // INPUT ---------------------------------------------------
    $('.ipt').each(function() {
        if($(this).find('.btn-clear').length){
            var $container = $(this);
            var $textInput = $container.find('input');
            var $clearButton = $container.find('.btn-clear');

            $textInput.on('input focus', function() {
                if ($textInput.val().length > 0) {
                    $clearButton.show();
                } else {
                    $clearButton.hide();
                }
            });

            $clearButton.on('click', function() {
                $textInput.val('');
                $clearButton.hide();
                $textInput.focus();
            });

            $textInput.on('blur', function() {
                setTimeout(function() {
                    if (!$clearButton.is(':focus')) {
                        $clearButton.hide();
                    }
                }, 0);
            });

            $clearButton.on('blur', function() {
                $clearButton.hide();
            });
        }
    });


    // CALENDAR ---------------------------------------------------
    if($('.calendar').length || $('.fullcalendar-container.day').length){
        var dateFormat = "yy-mm-dd";

        // Datepicker의 언어 설정
        $.datepicker.regional['ko'] = {
            closeText: '닫기',
            prevText: '이전',
            nextText: '다음',
            currentText: '오늘',
            monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
            monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
            dayNames: ['일','월','화','수','목','금','토'],
            dayNamesShort: ['일','월','화','수','목','금','토'],
            dayNamesMin: ['일','월','화','수','목','금','토'],
            weekHeader: '주',
            dateFormat: dateFormat,
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: true,
            yearSuffix: '년'
        };

        $.datepicker.setDefaults($.datepicker.regional['ko']);

        // calendar input에 datepicker 적용
        if ($('.calendar').length) {
            $('.calendar input').each(function () {
                var $input = $(this);

                // 특수기호 포함 0000-00-00 10자리
                $input.attr("maxlength", 10);
                $input.delegate(this,"keyup",function(){
                    var format = $(this).val().replace(/[^0-9]/g, "").replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
                    $(this).val(format);
                    if($(this).val().length == 10){
                        if(!DateLib.setValideDate($(this))){
                            $(this).focus();
                        }
                    }
                });

                // readonly 상태라면 datepicker를 적용하지 않음
                if (!$input.prop('readonly')) {
                    $input.datepicker({
                        beforeShow: function (input, inst) {
                            setTimeout(function () {
                                var $calendar = $(inst.dpDiv);

                                // 웹접근성 관련 속성 설정
                                $calendar.attr('role', 'application').find('a').attr({
                                    'role': 'button',
                                    'tabindex': 0,
                                }).on("keypress", function(){
                                  $(this).trigger('click').focus($(this));
                              });

                                // 팝업 내부로 초점 이동
                                $calendar.find('a').first().focus();

                                // 팝업 내부 키보드 탐색 처리
                                $calendar.off('keydown').on('keydown', function (e) {
                                    var $focusableElements = $calendar.find('a, button');
                                    var focusedIndex = $focusableElements.index(document.activeElement);

                                    if (e.key === 'Tab') {
                                        if (e.shiftKey && focusedIndex === 0) {
                                            // Shift + Tab으로 첫 번째 요소에서 입력 필드로 복귀
                                            e.preventDefault();
                                            $input.focus();
                                        } else if (!e.shiftKey && focusedIndex === $focusableElements.length - 1) {
                                            // Tab으로 마지막 요소에서 입력 필드로 복귀
                                            e.preventDefault();
                                            $input.focus();
                                            $input.datepicker('hide'); // 팝업 닫기
                                        }
                                    }
                                });
                            }, 0);
                        },
                        onClose: function (dateText, inst) {
                            // Datepicker 닫힐 때 입력 필드로 초점 복원
                            $(inst.input).focus();
                        }
                    });
                }

                // 추가로 focus나 click 이벤트에서 팝업을 막기
                $input.on('focus click', function (e) {
                    if ($input.prop('readonly')) {
                        e.preventDefault(); // 클릭이나 포커스를 차단
                    }
                });
            });
        }



    }

    // TEXTAREA ---------------------------------------------------
    $('.txtarea textarea').each(function() {

        // 글자 수 계산 설정
        if ($(this).siblings('.txtlength').length) {

            var maxLength = $(this).attr('maxlength');
            $(this).parents('.txtarea').find('.maxlength').html(maxLength);
            $(this).parents('.txtarea').find('.cntlength').html(0);

            // 초기 값 설정
            if ($(this).val().length > 0) {
                $(this).parents('.txtarea').find('.cntlength').html($(this).val().length).addClass('on');
            }

            // 키 입력 이벤트 리스너 설정
            $(this).on('keyup', function() {
                var length = $(this).val().length;
                var $cntlength = $(this).siblings('.txtlength').find('.cntlength');

                length > 0?  $cntlength.addClass('on'): $cntlength.removeClass('on');

                $cntlength.html(length);
            });
        }

        // 바이트 계산 설정
        else if ($(this).siblings('.txtbyte').length) {

            var maxByte = $(this).data('maxbyte');
            $(this).parents('.txtarea').find('.maxlength').html(maxByte + 'byte');
            $(this).parents('.txtarea').find('.cntlength').html(0 + 'byte');

            // 초기 값 설정
            if ($(this).val().length > 0) {
                $(this).parents('.txtarea').find('.cntlength').html(calculateBytes($(this).val()) + ' byte').addClass('on');
            }

            $(this).on('input', function() {
                var text = $(this).val();
                var byteCount = calculateBytes(text);
                var $cntlength = $(this).siblings('.txtbyte').find('.cntlength');

                if (byteCount > maxByte) {
                    $(this).val(truncateToMaxBytes(text, maxByte));
                    byteCount = calculateBytes($(this).val());
                }

                byteCount > 0 ? $cntlength.addClass('on') : $cntlength.removeClass('on');

                $cntlength.html(byteCount + 'byte');
            });
        }
    });

    // 텍스트의 바이트 수를 계산하는 함수
    function calculateBytes(text) {
        var byteCount = 0;
        for (var i = 0; i < text.length; i++) {
            var charCode = text.charCodeAt(i);
            if (charCode <= 0x007F) {
                byteCount += 1;
            } else if (charCode <= 0x07FF) {
                byteCount += 2;
            } else if (charCode <= 0xFFFF) {
                byteCount += 3;
            } else {
                byteCount += 4;
            }
        }
        return byteCount;
    }

    // 최대 바이트 수에 맞게 텍스트를 자르는 함수
    function truncateToMaxBytes(text, maxBytes) {
        var byteCount = 0;
        var truncatedText = '';
        for (var i = 0; i < text.length; i++) {
            var charCode = text.charCodeAt(i);
            var charByteSize = 0;
            if (charCode <= 0x007F) {
                charByteSize = 1;
            } else if (charCode <= 0x07FF) {
                charByteSize = 2;
            } else if (charCode <= 0xFFFF) {
                charByteSize = 3;
            } else {
                charByteSize = 4;
            }

            if (byteCount + charByteSize > maxBytes) {
                break;
            }
            byteCount += charByteSize;
            truncatedText += text[i];
        }
        return truncatedText;
    }

    // SORTABLE ---------------------------------------------------
    if($('.sortable-box').length){
        $('.sortable-box').sortable({
            placeholder: "ui-state-highlight",
            update: function(event, ui) {
                updateAriaAttributes($(this));
            },
            start: function(event, ui) {
                ui.item.attr("aria-grabbed", "true");
            },
            stop: function(event, ui) {
                ui.item.attr("aria-grabbed", "false");
            }
        });

        function updateAriaAttributes() {
            $('.sortable-box > li').each(function(index) {
                $(this).attr("aria-posinset", index + 1);
                $(this).attr("aria-setsize", $('.sortable-box > li').length);
            });
        }

        updateAriaAttributes();

        // KEYBOARD
        $(document).on('keydown', '.sortable-box li', function(event) {
            var $this = $(this);
            var $items = $('.sortable-box li');
            var index = $items.index($this);

            if (event.key === 'ArrowUp' && index > 0) {
                event.preventDefault(); // 스크롤 방지

                var $prev = $items.eq(index - 1);
                $this.insertBefore($prev);

            } else if (event.key === 'ArrowDown' && index < $items.length - 1) {

                event.preventDefault(); // 스크롤 방지
                var $next = $items.eq(index + 1);
                $this.insertAfter($next);

            }

            updateAriaAttributes();
            $this.focus();
        });
    }

    // STAR RATING ---------------------------------------------------
    $('.star-rating').each(function() {
        var $starRating = $(this);
        var $ratingValue = $starRating.siblings('.rating-value');
        var $inputs = $starRating.find('input');
        var checkedValue = $starRating.find('input:checked').val() || 0;

        $ratingValue.text('(' + checkedValue + ')');
        for (var i = 0; i < checkedValue; i++) {
            $starRating.find('label').eq(i).addClass('is-checked');
        }

        $inputs.on('change', function() {
            var $input = $(this);

            $starRating.find('label').removeClass('is-checked');
            for (var i = 0; i < $input.val(); i++) {
                $starRating.find('label').eq(i).addClass('is-checked');
            }

            $ratingValue.text('(' + $input.val() + ')')
        });
    });

    // TABLE HOVER ======================================================================
    $('.action-row').hover(function(){
        $(this).addClass('hover');
        $(this).prev('.content-row').addClass('is-hover');
    }, function(){
        $(this).removeClass('hover')
        $(this).prev('.content-row').removeClass('is-hover');
    })

    // LOAD / RESIZE =====================================================================
    $(window).on('load resize', function(){
        var viewportWidth = window.innerWidth || $(window).width();

        var tmp = 250;
        $('.header-bottom .gnb > ul > li > ul').each(function(index, item){
            if($(item).outerHeight() > tmp){
                tmp = $(item).outerHeight();
            }
        })
        $('.gnb-bg').css('height', tmp + 'px');

        // LNB ------------------------------------------------
        if($('.lnb').length && viewportWidth > 1024){

            if(viewportWidth < 1280 && viewportWidth > 1024){ // 1024~1280일때 LNB 닫기
                $('.container').addClass('lnb-collapsed');
            }
            $('.lnb .wrap').css('height', $('.lnb nav').outerHeight(true));
            lnbBtnPositionSet();
            $('.lnb').css({'opacity' : 1,'visibility' : 'visible',})
        }

    });

    $(window).on('load scroll', function(){
    if($('.footer').length > 0)
          checkFooterInView();
    });


    $('.tbl.list table tr td a').on('click', function(){

    var target = $('.tbl.list table tr td a')
      target.not($(this)).parents('tr').removeClass('on')
        $(this).parents('tr').addClass('on');

    });
    $(document).on('click', '.tbl.list table #tbodyNcsLrcl tr td a', function(){
      var target = $('.tbl.list table #tbodyNcsLrcl tr td a')
        target.not($(this)).parents('tr').removeClass('on')
        $(this).parents('tr').addClass('on');
       });
    $(document).on('click', '.tbl.list table #tbodyNcsMlsf tr td a', function(){
      var target = $('.tbl.list table #tbodyNcsMlsf tr td a')
        target.not($(this)).parents('tr').removeClass('on')
        $(this).parents('tr').addClass('on');
       });
    $(document).on('click', '.tbl.list table #tbodyNcsScla tr td a', function(){
        var target = $('.tbl.list table #tbodyNcsScla tr td a')
        target.not($(this)).parents('tr').removeClass('on')
        $(this).parents('tr').addClass('on');
       });
    $(document).on('click', '.tbl.list table #tbodyNcsSbdv tr td a', function(){
        var target = $('.tbl.list table #tbodyNcsSbdv tr td a')
        target.not($(this)).parents('tr').removeClass('on')
        $(this).parents('tr').addClass('on');
       });

    /*
    *    웹접근성 점검내용 보완 i_vha 2025-02-05
    *    a tag, button 등 클릭 시 해당 요소로 포커스 이동 되도록 설정
    */
    $("a:not(:disabled), button:not(:disabled), input[type='button']:not(:disabled), input[type='submit']:not(:disabled)").click(function(){
        $(this).focus();
    });
});
