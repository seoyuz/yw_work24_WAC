// document.addEventListener('keydown', function(event){
//   if(event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
//     event.preventDefault();
//     alert("개발자 도구는 사용이 금지되어 있습니다.");
//   }
// });

// !function(){
//   function detectDevTool(allow){
//     if(isNaN(+allow)) allow = 100;
//     var start = +new Date(); // Validation of built-in Ojbect tamper prevention.
//     debugger;
//     var end = +new Date();
//     if(isNaN(start) || isNaN(end) || end-start > allow) {
//       alert("개발자 도구는 사용이 금지되어 있습니다.");
//     }
//   }

//   if(window.attachEvent){
//     if(document.readyState === "complete" || document.readyState === "interactive") {
//       detectDevTool();
//       window.attachEvent('onresize', detectDevTool);
//       window.attachEvent('onmousemove', detectDevTool);
//       window.attachEvent('onfocus', detectDevTool);
//       window.attachEvent('onblur', detectDevTool);
//     } else {
//       setTimeout(argument.callee, 0);
//     }
//   } else {
//     window.addEventListener('load', detectDevTool);
//     window.addEventListener('resize', detectDevTool);
//     window.addEventListener('mousemove', detectDevTool);
//     window.addEventListener('focus', detectDevTool);
//     window.addEventListener('blur', detectDevTool);
//   }
// }();

const bannerState = {
   pcBannerRow: ""
  ,mbBannerRow: ""
}

$(function(){
  if(typeof loginPopYN == "undefined" || loginPopYN != "Y"){ // xhac00_m13에서만 넘겨줌. 로그인 팝업 사용하지 않기 위함.
    fn_header_userAuthenticationPopupOpen();
    }
  //하단 닫기 버튼 클릭
  $("#userAuthenticationPopup .popup-footer button:first-child").click(function(){
    $("#userAuthenticationPopup .popup-close").click();
  });
  //로그인 버튼 클릭
  $("#userAuthenticationPopup .popup-footer button.ico-login").click(function(){
    window.location.href = ComLib.c.CONTEXT_PATH + "/a/b/openLogin.do";
  });
  //메인으로 버튼 클릭
  $("#userAuthenticationPopup .popup-footer button.ico-home").click(function(){
    onSpinBlockUI();
    window.location.href = window.origin;
  });

  // 비로그인시, 메뉴 5개, 로그인시 청년 메뉴 6개, 기업 메뉴 7개
  var gnb_li = $('.header-bottom .gnb > ul > li').length;
  if(gnb_li > 6){
    $('.header-bottom .gnb').addClass('business_gnb')
  }

  // 로그인시 .content 클래스 추가하여 사이즈 조절
  if(gnb_li > 5){
    $('.content').addClass('logged-in')
    $('.container').addClass('logged-in')
    $('.srch-wrap').addClass('logged-in')
    $('#header-new').addClass('logged-in')
  }

  //실명인증 팝업
  $("#userRlnmCrfcCfrmPopup .popup-footer button, #userRlnmCrfcCfrmPopup .popup-footer a").click(function(){
    $("#userRlnmCrfcCfrmPopup .popup-close").click();
  });

  const headerBanner = new Swiper('#header-new .header-banner', {
            loop : true,
            effect : 'fade',
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation : {
            nextEl : '.btn-next',
            prevEl : '.btn-prev',
        },
        pagination: {
            el: ".pagination-new",
            // clickable: true,
            type: "fraction",
        },
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                resetTabindex();
            },
            activeIndexChange: function () {
                resetTabindex();
            }
        },
        observer: true,
        observParents: true
    });
    // 웹접근성 스와이퍼 포커스
    function resetTabindex() {
        const slides = document.querySelectorAll(".header-banner .swiper-slide");
        const activeSlide = document.querySelectorAll(".header-banner .swiper-slide-active");
        const visibleSlide = document.querySelectorAll(".header-banner .swiper-slide-visible");

        // 슬라이드가 존재하지 않으면 실행 중단
        if (!slides || slides.length === 0) {
            return;
        }

        // 모든 슬라이드의 링크에서 tabindex를 -1로 설정
        slides.forEach(slide => {
            const link = slide.querySelector('a');
            if (link) link.setAttribute('tabindex', '-1');
        });

        // 활성 슬라이드의 링크 tabindex를 0으로 설정
        if (activeSlide) {
            activeSlide.forEach(slide => {
                const activeLink = slide.querySelector('a');
                if (activeLink) activeLink.setAttribute('tabindex', '0');
            });
        }

        if (visibleSlide) {
            visibleSlide.forEach(slide => {
                const visibleLink = slide.querySelector('a');
                if (visibleLink) visibleLink.setAttribute('tabindex', '0');
            });
        }
    }

    const autoplaySlide = document.querySelector('.header-banner .btn-stop');
    if (autoplaySlide) {
        autoplaySlide.addEventListener('click', function() {
            slideAutoplay(headerBanner, autoplaySlide);
        });
    }


    // 슬라이드 재생/정지 함수
    function slideAutoplay(slide, autoplayBtn) {
        let isActive = autoplayBtn.classList.contains('active');

        if (!isActive) { //정지상태
            slide.autoplay.stop(); //재생하기
            autoplayBtn.classList.add('active');
            autoplayBtn.querySelector('span').textContent = '재생';
        }
        else { //재생상태
            slide.autoplay.start(); //멈추기
            autoplayBtn.classList.remove('active');
            autoplayBtn.querySelector('span').textContent = '멈추기';
        }
    }
    // 배너 세팅
    setBannerByHeader(headerBanner)

    // resize에 따른 변경
    $(window).resize(function(){
        updateBannerOnReSize(headerBanner);
    });
});

function fn_header_menuMove(menuId){
  fn_header_checkMenuAuth(undefined, function(){
    var form = new FormLib.Form();
    form.createForm("menuMove", ComLib.c.CONTEXT_PATH + "/cmm/menu/moveMenu.do", "POST", null,null).addHidden("menuId", menuId);
    form.addBody();
    ComLib.submit("menuMove");
  }, menuId);
}
function fn_header_prevMenuMove(){
    if(window.location.href == document.referrer){
      onSpinBlockUI();
      window.location.href = ComLib.c.CONTEXT_PATH;
    }
    else{
      var form = new FormLib.Form();
      form.createForm("prevMenuMove", ComLib.c.CONTEXT_PATH + "/cmm/menu/moveBfrMenu.do", "POST", null,null).addHidden("url", document.referrer);
      form.addBody();
      ComLib.submit("prevMenuMove");
    }

}

function fn_header_checkMenuAuth(url, callBackFnc, menuId){
  var param = new Object();
  if(!(typeof url == "undefined" || url == undefined || url == null || url == "")){
    param.url = url;
  }
  else if(!(typeof menuId == "undefined" || menuId == undefined || menuId == null || menuId == "")){
    param.menuId = menuId;
  }
  else{
    return false;
  }

  var request = ComLib.ajaxReqObj(ComLib.c.CONTEXT_PATH + "/cmm/menu/checkMenuAuth.do", param, false);
  request.done(function (data, statusText, xhr) {
    if(!(typeof data == "undefined" || data == undefined || data == null)){
      data = JSON.parse(data);
      if(!data.chckRslt){
        //유효하지 않다.
        if(!(typeof data.menuPurpSecd == "undefined" || data.menuPurpSecd == undefined || data.menuPurpSecd == null)){
          if(!(typeof sessionConcTrgtSeCd == "undefined"|| sessionConcTrgtSeCd == undefined || sessionConcTrgtSeCd == "") && sessionConcTrgtSeCd == data.menuPurpSecd){
            //특수한 경우 - 로그인 된 상태에서 중간에 세션이 끊겼던 경우
            fn_header_userAuthenticationPopupOpen("99999");
          }
          else{
            fn_header_userAuthenticationPopupOpen(data.menuPurpSecd, true);
          }
        }
      }
      else if(!(typeof callBackFnc == "undefined" || callBackFnc == undefined) && typeof callBackFnc == "function"){
        callBackFnc();
      }
      return data.chckRslt;
    }
  });
}
function fn_header_userAuthenticationPopupOpen(menuPurpSecd, clsBtn){
  var _menuPurpSecd = sessionCurrentMenuPurpSecd; //dafault 현재페이지의 메뉴용도구분코드
  if(!(typeof menuPurpSecd == "undefined" || menuPurpSecd == undefined || menuPurpSecd == null || menuPurpSecd == "")){
    //파라미터로 넘어온 메뉴용도구분코드로 세팅한다.
    _menuPurpSecd = menuPurpSecd;
  }
  if(!(typeof _menuPurpSecd == "undefined" || _menuPurpSecd == undefined || _menuPurpSecd == "" ||
    typeof sessionConcTrgtSeCd == "undefined"|| sessionConcTrgtSeCd == undefined || sessionConcTrgtSeCd == "" ||
    _menuPurpSecd == sessionConcTrgtSeCd || _menuPurpSecd == "EBM02")){
      $("#userAuthenticationPopup .popup-footer button.ico-home").hide();
      //비로그인 공통 메뉴가 아니다.
      //닫기 버튼 처리
      if(!(typeof clsBtn == "undefined" || clsBtn == undefined || clsBtn == null || clsBtn == "") && clsBtn){
        $("#userAuthenticationPopup .popup-footer button").eq(0).show();
        $("#userAuthenticationPopup .popup-close").show();
        $("#userAuthenticationPopup .popup-footer button.ico-prev").hide();
      }
      else{
        $("#userAuthenticationPopup .popup-footer button").eq(0).hide();
        $("#userAuthenticationPopup .popup-close").hide();
        $("#userAuthenticationPopup .popup-footer button.ico-prev").eq(1).show();
      }
      if(sessionConcTrgtSeCd == "EBM02"){
        //로그인 필요
        var msg = "로그인이 필요한 서비스 입니다.<br><br>로그인 페이지로 이동 하시겠습니까?";
        $("#userAuthenticationPopup .popup-body > p").empty();
        $("#userAuthenticationPopup .popup-body > p").append(msg);
        $("#userAuthenticationPopup .popup-header").text("로그인 필요");
        $("#userAuthenticationPopup .popup-footer button.ico-login").show();
        openPopup("#userAuthenticationPopup", $(".header .header-top .logo"));
      }
      else if(!(sessionConcTrgtSeCd == "EBM02" || _menuPurpSecd == "EBM05" || _menuPurpSecd == "99999")) {
        //로그인 공통 메뉴가 아니다.
        if(_menuPurpSecd == "EBM00"){
          //기업회원만 사용가능 메뉴에 청년회원 접근
          var msg = "기업회원으로 로그인이 필요한 서비스 입니다.<br><br>현재 개인회원으로 로그인 되어있습니다.";
          $("#userAuthenticationPopup .popup-header").text("확인필요");
          $("#userAuthenticationPopup .popup-body > p").empty();
          $("#userAuthenticationPopup .popup-body > p").append(msg);
          $("#userAuthenticationPopup .popup-footer button.ico-login").hide();
          openPopup("#userAuthenticationPopup", $(".header .header-top .logo"));
        }
        else if(_menuPurpSecd == "EBM01"){
          //청년회원만 사용가능 메뉴에 기업회원 접근
          var msg = "개인회원으로 로그인이 필요한 서비스 입니다.<br><br>현재 기업회원으로 로그인 되어있습니다.";
          $("#userAuthenticationPopup .popup-header").text("확인필요");
          $("#userAuthenticationPopup .popup-body > p").empty();
          $("#userAuthenticationPopup .popup-body > p").append(msg);
          $("#userAuthenticationPopup .popup-footer button.ico-login").hide();
          openPopup("#userAuthenticationPopup", $(".header .header-top .logo"));
        }
      }
      else if(_menuPurpSecd == "99999"){
        //세션이 끊긴 에외적인 경우
        $("#userAuthenticationPopup .popup-footer button.ico-home").show();
        $("#userAuthenticationPopup .popup-footer button.ico-login").hide();
        $("#userAuthenticationPopup .popup-footer button.ico-prev").hide();
        $("#userAuthenticationPopup .popup-footer button").eq(0).hide();
        $("#userAuthenticationPopup .popup-close").hide();
        var msg = "다른 창에서 로그아웃 되었거나 대기시간이 경과하여 세션이 만료 되었습니다.<br><br>다시 로그인 하여야 합니다.";
        $("#userAuthenticationPopup .popup-header").text("확인필요");
        $("#userAuthenticationPopup .popup-body > p").empty();
        $("#userAuthenticationPopup .popup-body > p").append(msg);
        openPopup("#userAuthenticationPopup", $(".header .header-top .logo"));
      }
    }
}

/* 임시 로그인 구현을 위해 추가 : 제거필요 */
function fn_openTmprLogin(){
  $("#tmprLoginPopup input").val("");
  openPopup("#tmprLoginPopup", $(".header .header-top .logo"));
  $("#tmprLoginPopup input").off().on("keydown", function(e){
    if(e.key == "Enter" || e.keyCode == 13){
      fn_tmprLogin();
    }
  });
}
function fn_tmprLogin(){
  var gbn = $("#tmprLoginPopup .tab-list button[aria-selected = 'true']").index() == 0 ? "I" : "C";
  if(gbn == "I" && $("#panelIndv input").val().replace(/[\D]/g, "") == ""){
    alert("테스트 로그인 정보를 입력하세요.");
    $("#panelIndv input").val($("#panelIndv input").val().replace(/[\D]/g, ""));
    $("#panelIndv input").focus();
    return false;
  }
  else if(gbn == "C" && $("#panelEntr input").val().replace(/[\D]/g, "") == ""){
    alert("테스트 로그인 정보를 입력하세요.");
    $("#panelEntr input").val($("#panelEntr input").val().replace(/[\D]/g, ""));
    $("#panelEntr input").focus();
    return false;
  }

  var param = {"gbn" : gbn};
  if(gbn == "I"){param.ssn = $("#panelIndv input").val().replace(/[\D]/g, "");}
  else{param.brno = $("#panelEntr input").val().replace(/[\D]/g, "");}
  var request = ComLib.ajaxReqObj(ComLib.c.CONTEXT_PATH + "/a/b/tmprLogin.do", param);
  request.done(function (data, statusText, xhr) {
    if(!(typeof data == "undefined" || data == undefined || data == null)){
      data = JSON.parse(data);
      if(!data.result){
        alert("로그인 정보가 유효하지 않습니다.");
        return false;
      }
      else{
        location.reload();
      }
    }
  });
}

/* 프로그램 신청시 실명인증까지 필요하여 추가 - 20250203 */
function fn_header_checkRlnmCrfcCfrmYn(callBackFnc){
  var request = ComLib.ajaxReqObj(ComLib.c.CONTEXT_PATH + "/a/b/checkRlnmCrfcCfrmYn.do", new Object(), false);
  request.done(function (data, statusText, xhr) {
    if(!(typeof data == "undefined" || data == undefined || data == null)){
      data = JSON.parse(data);
      if(data.rlnmCrfcCfrmYn != "Y"){
        //실명인증 필요
        openPopup("#userRlnmCrfcCfrmPopup", $(".header .header-top .logo"));
      }
      else if(!(typeof callBackFnc == "undefined" || callBackFnc == undefined) && typeof callBackFnc == "function"){
        callBackFnc();
      }
      return data.rlnmCrfcCfrmYn == "Y";
    }
  });
}

/* 배너 */
function setBannerByHeader(headerBanner){
  if (bannerState.pcBannerRow != "" && bannerState.mbBannerRow != "") return;
    /* pc
       1. (if)배너가 조회가 되며 pc이미지가 있을 경우 jsp when 분기의 pcSilde 사용
       2. (if)배너가 조회가 안될경우 jsp otherwise 분기의 pcSilde
       3. (else)배너가 조회가 되나 pc 이미지가 없을 경우 기본배너로 설정
    */
    if($("div[data-name='pcSlide']").length > 0){
        bannerState.pcBannerRow = $("div[data-name='pcSlide']").clone(true);
    }else{
        pcImgaddr = ComLib.c.CONTEXT_PATH + encodeURI("/static/images/commonNew/header-banner01.png");
        bannerState.pcBannerRow += '<div class="swiper-slide"  data-name= "pcSlide" data-info="청년고용정책 청년:Up(&#26989;)">';
        bannerState.pcBannerRow += '<a href="https://yw.work24.go.kr/main.do" target="_blank">';
        bannerState.pcBannerRow += '<img class="pc" src="' + pcImgaddr + '"alt="청년고용정책 청년:Up(&#26989) | 청년/기업 : 사업안내 및 참여 방법 문의 | 청년 : 일경험 중 부당대우, 애로사항 등 기타 일경험 관련문의 | 사업 안내 및 참여 방법 문의 상담센터 대표번호 1811-8447 | 미리경험하는 내일 내일의 걱정은 사라지고 내 일의 기대감은 커집니다.">';
        bannerState.pcBannerRow += '</a></div>';
    }
    /* mobile
       1. (if)배너가 조회가 되며 mobile 이미지가 있을 경우 jsp when 분기의 mbSlide 사용
       2. (if)배너가 조회가 안될경우 jsp otherwise 분기의 mbSlide
       3. (else)배너가 조회가 되나 mobile 이미지가 없을 경우 기본배너로 설정
    */
    if($("div[data-name='mbSlide']").length > 0){
        bannerState.mbBannerRow = $("div[data-name='mbSlide']").clone(true)
    }else{
        mbImgaddr = ComLib.c.CONTEXT_PATH + encodeURI("/static/images/commonNew/header-banner-mobile01.png");
        bannerState.mbBannerRow += '<div class="swiper-slide" data-name= "mbSlide" data-info="청년고용정책 청년:Up(&#26989;)">';
        bannerState.mbBannerRow += '<a href="https://yw.work24.go.kr/main.do" target="_blank">';
        bannerState.mbBannerRow += '<img class="mobile" src="' + mbImgaddr + '" alt="청년고용정책 청년:Up(&#26989) | 청년/기업 : 사업안내 및 참여 방법 문의 | 청년 : 일경험 중 부당대우, 애로사항 등 기타 일경험 관련문의 | 사업 안내 및 참여 방법 문의 상담센터 대표번호 1811-8447 | 미리경험하는 내일 내일의 걱정은 사라지고 내 일의 기대감은 커집니다.">';
        bannerState.mbBannerRow += '</a></div>';
    }
    updateBannerOnReSize(headerBanner);
}

function updateBannerOnReSize(headerBanner){
  // 비로그인일 경우 headerBanner에 정의된 태그 존재
  if($(headerBanner.el).length > 0){
    headerBanner.removeAllSlides();
        if($(window).width() > 768){
            headerBanner.appendSlide(bannerState.pcBannerRow);
        } else {
            headerBanner.appendSlide(bannerState.mbBannerRow);
        }
        headerBanner.loopDestroy();
        headerBanner.update();
        headerBanner.loopCreate();
        headerBanner.autoplay.start();
  }

}