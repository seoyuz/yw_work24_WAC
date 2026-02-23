let selectedDate = ""
document.addEventListener('DOMContentLoaded', function() {

    /* 251219 카운트업 효과 - 다시 보일 때마다 재생 (ej) */
    const counters = document.querySelectorAll(".counter");

    function startCount(el) {
        const target = Number(el.dataset.target);
        const duration = 1000;
        const start = Number(el.dataset.start) || 0;
        const startTime = performance.now();

        // 기존 애니메이션이 있으면 취소
        if (el._countAnimId) {
            cancelAnimationFrame(el._countAnimId);
            el._countAnimId = null;
        }

        function animate(time) {
            const progress = Math.min((time - startTime) / duration, 1);
            const value = Math.floor(start + (target - start) * progress);
            el.textContent = value.toLocaleString();

            if (progress < 1) {
                el._countAnimId = requestAnimationFrame(animate);
            } else {
                el.textContent = target.toLocaleString();
                el._countAnimId = null;
            }
        }

        el._countAnimId = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;

            if (entry.isIntersecting) {
                // 이미 애니메이션 중이면 중복 시작 방지
                if (el._countAnimId) return;

                // 보일 때마다 시작값으로 리셋 (dataset.start가 없으면 0)
                el.textContent = (Number(el.dataset.start) || 0).toLocaleString();
                startCount(el);
            } else {
                // 화면에서 벗어나면 애니메이션 취소하고 초기값으로 리셋
                if (el._countAnimId) {
                    cancelAnimationFrame(el._countAnimId);
                    el._countAnimId = null;
                }
                el.textContent = (Number(el.dataset.start) || 0).toLocaleString();
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(el => {
        if (!el.dataset.start) el.dataset.start = '0';
        observer.observe(el);
    });
    /* // 251219 카운트업 효과 - 다시 보일 때마다 재생 (ej) */

    const btnWraps = document.querySelectorAll('.tab-container-new > .btn-wrap');

    btnWraps.forEach((wrap) => {
        const tabBtns = wrap.querySelectorAll('button');

        if (tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    tabBtns.forEach(item => {
                        item.classList.remove('active');
                        item.removeAttribute('title');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('title', '선택됨');
                    //TO-DO
                    //데이터 조회

                    //슬라이드 초기화
/*                    swipers.forEach(swiper => {
                        swiper.slideToLoop(0,0,true);
                        // slideToLoop 직후 접근성 업데이트
                        updateSlideFocus(swiper);
                        updateSwiperAccessibility();
                    });*/

                    const swipersKeys = swipers.keys();
                    for(const swiper in swipersKeys){
                        const instance = swipersKeys[swiper];
                        if (typeof instance != "undefined" && instance != undefined && instance != ""){
                           swipers.get(instance).slideToLoop(0,0,true);
                           // slideToLoop 직후 접근성 업데이트
                           updateSlideFocus(swipers.get(instance));
                           updateSwiperAccessibility();
                         }
                    }
                });
            });
        }
    });

    const responsiveSwiperContainers = document.querySelectorAll('.swiper-container.responsive');
    const swipers = new Map(); // container → swiper 인스턴스 저장용

    function initResponsiveSwiper(container) {
        const instance = new Swiper(container, {
            spaceBetween: 24,
            navigation: {
                nextEl: container.querySelector('.btn-next'),
                prevEl: container.querySelector('.btn-prev'),
            },
            slidesPerView: 1,
            observer: true,
            observeParents: true,
            pagination: {
                el: container.querySelector(".pagination-new"),
                clickable: true,
                renderBullet: function(index, className) {
                    return `<button class="${className}"><span class="blind">${index + 1}번 슬라이드</span></button>`;
                },
            },
            on: {
                init() {
                    updateSlideFocus(this);
                },
                transitionEnd() {
                    updateSlideFocus(this);
                },
                touchEnd() {
                    if (this.isEnd) {
                        this.slideToLoop(-1);
                        updateSlideFocus(this);
                        updateSwiperAccessibility();
                    }
                },
                slideChangeTransitionEnd() {
                    updateSlideFocus(this);
                },
            },
        });

        swipers.put(container.id, instance);
    }

    function destroyResponsiveSwiper(container) {
        const instance = swipers.get(container.id);
        if (instance) {
            instance.destroy(true, true); // 완전히 제거
            swipers.remove(container.id);

            console.log('Destroyed Swiper for container:', container);

        }
    }

    /* ------------------ 핵심 로직 ------------------ */
    function updateResponsiveSwipers() {
        responsiveSwiperContainers.forEach(container => {
            if (window.innerWidth < 769) {
                // 768px 이하 → Swiper 생성
                if (!swipers.get(container.id)) initResponsiveSwiper(container);
            } else {
                // 769px 이상 → Swiper 완전 해제
                destroyResponsiveSwiper(container);
            }
        });
    }

    /* 최초 실행 */
    updateResponsiveSwipers();

    /* 리사이즈 대응 */
    window.addEventListener('resize', () => {
        updateResponsiveSwipers();
    });

    const tabWraps = document.querySelectorAll('.detail-wrap');

    tabWraps.forEach((wrap) => {
        const tabBtns = wrap.querySelectorAll('.btn-new');
        const tabConts = document.querySelectorAll('.contents');

        if (tabBtns.length > 0) {
            tabBtns.forEach((btn, index) => {
                btn.addEventListener('click', function() {
                    tabBtns.forEach(item => {
                        item.classList.remove('active');
                        item.removeAttribute('title');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('title', '선택됨');
                });
            });
        }
    });

    const dropdowns = document.querySelectorAll(".dropdown-new");
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector(".dropdown-btn");
        const box = dropdown.querySelector(".dropdown-box");
        const closeBtn = dropdown.querySelector(".popup-close");
        const apply = dropdown.querySelector(".dropdown-apply");
        const applyPrjType = dropdown.querySelector(".dropdown-apply-prjtype");

        const focusableSelectors =
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

        let focusableElements, firstFocusable, lastFocusable;

        // 열기/닫기 토글
        btn.addEventListener("click", e => {
            e.stopPropagation();

            const isActive = dropdown.classList.toggle("active");
            box.hidden = !isActive;
            btn.setAttribute("aria-expanded", isActive);

            if (isActive) {
                openDropdown(dropdown);
            } else {
                closeDropdown(dropdown);
            }
        });

        // 적용버튼 2026.01.14 add
        if(apply != null){
          apply.addEventListener("click", e => {
              e.stopPropagation();

              const selectedValue = box.querySelector('input[type="radio"]:checked')?.nextElementSibling?.textContent;
              btn.textContent = selectedValue;
              //조회
              fn_selectPrgmByDtyCdRegionNew();
              closeDropdown(dropdown);
          });
      }

        // 적용버튼 2026.01.14 add
        if(applyPrjType != null){
          applyPrjType.addEventListener("click", e => {
              e.stopPropagation();

              const selectedTextValue = box.querySelector('input[type="radio"]:checked')?.nextElementSibling?.textContent;
              const selectedValue = box.querySelector('input[type="radio"]:checked').value;
              btn.textContent = selectedTextValue;
              //조회
              fn_selectMonthScdu(selectedValue);
              closeDropdown(dropdown);
          });
       }

        // 닫기 버튼 클릭 시 닫기
        closeBtn.addEventListener("click", e => {
            e.stopPropagation();
            closeDropdown(dropdown);
        });

        function openDropdown(target) {
            // 다른 드롭다운 닫기
            dropdowns.forEach(d => {
                if (d !== target) closeDropdown(d);
            });

            // 포커스 가능한 요소 목록
            focusableElements = box.querySelectorAll(focusableSelectors);
            firstFocusable = focusableElements[0];
            lastFocusable = focusableElements[focusableElements.length - 1];

            if (firstFocusable) firstFocusable.focus();

            document.addEventListener("click", handleOutsideClick);
            document.addEventListener("keydown", handleKeydown);
        }

        function closeDropdown(target) {
            if (!target.classList.contains("active")) return;
            target.classList.remove("active");
            box.hidden = true;
            btn.setAttribute("aria-expanded", "false");
            btn.focus();

            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("keydown", handleKeydown);
        }

        function handleOutsideClick(e) {
            if (!dropdown.contains(e.target)) {
                closeDropdown(dropdown);
            }
        }

        function handleKeydown(e) {
            if (!dropdown.classList.contains("active")) return;

            if (e.key === "Escape") {
                e.preventDefault();
                closeDropdown(dropdown);
            }

            if (e.key === "Tab") {
                if (focusableElements.length === 0) return;

                if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
                }
            }
        }
    });

    const selects = document.querySelectorAll(".select-box-new");
    selects.forEach(select => {
        select.addEventListener("click", e => {
            e.stopPropagation();

            let isOpen = select.classList.contains('open');

            if( isOpen ){
                select.classList.remove('open');
            } else{
                select.classList.add('open');
            }
        });

        select.addEventListener("focusout", () => {
            setTimeout(() => {
                // 현재 포커스된 요소
                const active = document.activeElement;

                // 만약 select 내부에 포커스가 하나라도 남아있다면 종료
                // contains() → select 내부인지 확인
                if (select.contains(active)) return;

                // 내부 포커스가 모두 사라진 경우 open 제거
                select.classList.remove("open");
            }, 0);
        });


        // 바깥 클릭 시 닫기
        document.body.addEventListener('click', function (e) {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });
    });


    const programSlider = new Swiper('.main .program-slider .swiper-container', {
        navigation : {
            nextEl : '.program-slider .btn-next',
            prevEl : '.program-slider .btn-prev',
        },
        pagination: {
            el: ".program-slider .pagination-new",
            clickable: true,
            renderBullet: function (index, className) {
                return '<button type="button" class="' + className + '"><span>' + (index + 1) + '번 슬라이드' + '</span></button>';
            },
        },
        slidesPerView: 1,
        spaceBetween: 24,
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                updateSlideFocus(this);
            },
            slideChangeTransitionEnd: function () {
                updateSlideFocus(this);
            }
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 24 },
            1025: { slidesPerView: 4, spaceBetween: 24 },
        },
    });


    if (window.innerWidth > 769) {
        // 768px 이상 → Swiper 완전 해제
        destroyResponsiveSwiper(programSlider);
    }

    const videoSlider = new Swiper('.main .sec04 .video-wrap .swiper-container', {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        loop:true,
        slidesPerView: "auto",
        observer: false,
        observeParents: false,

        navigation : {
            nextEl : '.video-wrap .btn-next',
            prevEl : '.video-wrap .btn-prev',
        },
        slidesPerView : 'auto',
        spaceBetween : 24,
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                updateSlideFocus(this);
            },
            slideChangeTransitionEnd: function () {
                updateSlideFocus(this);
                updateSwiperAccessibility();
            }
        },
    });


    const btnSlider = document.querySelectorAll('.details.swiper-container');
    btnSlider.forEach(container => {
        const tabSwiper = new Swiper(container, {
            // 기본값 (모바일 전용 설정)
            slidesPerView: 'auto',
            spaceBetween: 8,
            navigation: {
                nextEl: '.details .next',
                prevEl: '.details .prev',
            },

            // 반응형 설정
            breakpoints: {
                769: {
                    // 769px 이상에서는 슬라이드 기능 비활성화 효과
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                    allowTouchMove: false, // 드래그 불가
                    simulateTouch: false,
                    navigation: false,
                    pagination: false,
                },
            },
        });
    });


    const partnerSlider = new Swiper('.main .partner-slider .swiper-container', {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        loop:true,
        slidesPerView: "auto",
        // loopedSlides: 5, //251219 삭제(ej
        observer: false,
        observeParents: false,

        navigation : {
            nextEl : '.partner-slider .btn-next',
            prevEl : '.partner-slider .btn-prev',
        },
        slidesPerView : 'auto',
        spaceBetween : 24,
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                updateSlideFocus(this);
            },
            slideChangeTransitionEnd: function () {
                updateSlideFocus(this);
                updateSwiperAccessibility();
            }
        },
    });

    const autoplaySlide = document.querySelector('.partner-slider .btn-stop');
    if (autoplaySlide) {
        autoplaySlide.addEventListener('click', function() {
            slideAutoplay(partnerSlider, autoplaySlide);
        });
    }

    /* i_vjh */
    const videoAutoplaySlide = document.querySelector('.video-wrap .btn-stop');
    if (videoAutoplaySlide) {
        videoAutoplaySlide.addEventListener('click', function() {
            slideAutoplay(videoSlider, videoAutoplaySlide);
        });
    }

    // 재생/정지 함수
    function slideAutoplay(slide, autoplayBtn) {
        let isActive = autoplayBtn.classList.contains('active'); // 재생중
        // //active 없을때 정지 버튼
        // //지금 없음 -> 정지상태
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

    // tip 박스 팝업
    const tipBtn = document.querySelectorAll('.tip-wrap .tip-btn');
    const tipBox = document.querySelectorAll('.tip-wrap .tip-box');

    if (tipBtn.length) {
        tipBtn.forEach((btn, index) => {
            const box = tipBox[index];

            btn.addEventListener('click', function(e) {
                e.stopPropagation();

                tipBox.forEach(b => b.classList.remove('active'));
                tipBtn.forEach(b => b.setAttribute('title', '닫기'));

                box.classList.add('active');
                btn.setAttribute('title', '닫기');

                // 닫기 버튼 처리
                const closeBtn = box.querySelector('.tip-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function () {
                        box.classList.remove('active');
                        btn.setAttribute('title', '닫기');
                        btn.focus();
                    });
                }

                // 바깥 클릭 시 닫기
                document.body.addEventListener('click', function (e) {
                    if (!box.contains(e.target) && !btn.contains(e.target)) {
                        box.classList.remove('active');
                        btn.setAttribute('title', '닫기');
                    }
                }, { once: true });
            });
        });
    }


    // 슬라이드 포커스 및 tabindex 제어 통합 함수
    function updateSlideFocus(swiper) {
        if (!swiper || !swiper.slides) return;

        const slides = swiper.slides;
        const visibleSlides = swiper.$el[0].querySelectorAll('.swiper-slide-visible');

        // focus 가능한 요소 셀렉터
        const focusableSelector = `
            a, button, input, textarea, select, summary, details,
            [href], [tabindex]:not([tabindex="-1"]),
            [contenteditable="true"]
        `;

        // 1) 모든 슬라이드 tabindex -1 + aria-hidden 추가
        slides.forEach(slide => {
            const focusables = slide.querySelectorAll(focusableSelector);
            focusables.forEach(el => el.setAttribute('tabindex', '-1'));

            slide.setAttribute('aria-hidden', 'true');
        });

        // 2) 활성 슬라이드 tabindex = 0
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
            const focusables = activeSlide.querySelectorAll(focusableSelector);
            focusables.forEach(el => el.setAttribute('tabindex', '0'));

            activeSlide.removeAttribute('aria-hidden');
        }

        // 3) 보이는 슬라이드(tab / auto width 구성) tabindex = 0
        visibleSlides.forEach(slide => {
            const focusables = slide.querySelectorAll(focusableSelector);
            focusables.forEach(el => el.setAttribute('tabindex', '0'));

            slide.removeAttribute('aria-hidden');
        });
    }


    function updateSwiperAccessibility() {
        const slides = document.querySelectorAll('.swiper-slide');

        // 포커스 가능한 요소 셀렉터
        const focusableSelector = `
            a, button, input, textarea, select, details,
            [tabindex]:not([tabindex="-1"]),
            [contenteditable="true"]
        `;

        slides.forEach(slide => {
            const isHidden = slide.getAttribute('aria-hidden') === 'true';
            const focusables = slide.querySelectorAll(focusableSelector);

            if (isHidden) {
                // 숨겨진 슬라이드 → 접근성 트리에서 제외 + 포커스 차단
                slide.setAttribute('inert', '');

                focusables.forEach(el => {
                    el.setAttribute('tabindex', '-1');
                });
            } else {
                // 활성 슬라이드 → 접근 가능
                slide.removeAttribute('inert');

                focusables.forEach(el => {
                    el.setAttribute('tabindex', '0');
                });
            }
        });
    }


      //달력 script//////////////////////
  const yearSelect = document.getElementById("yearSelect");
  const monthSelect = document.getElementById("monthSelect");

  const title = document.getElementById("title");
  const dates = document.getElementById("dates");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  let current = new Date();
  selectedDate = new Date(); // ⭐ 오늘 날짜 자동 선택


  function initSelectBox() {
    const thisYear = new Date().getFullYear();

    for (let y = thisYear - 10; y <= thisYear + 10; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
    }

    for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    monthSelect.appendChild(opt);
    }
  }

  function renderCalendar() {
    dates.innerHTML = "";

    const year = current.getFullYear();
    const month = current.getMonth();

    title.textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    // 이전 달
    for (let i = firstDay - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.textContent = prevLastDate - i;
    div.classList.add("other");
    dates.appendChild(div);
    }

    // 이번 달
    for (let i = 1; i <= lastDate; i++) {
    const div = document.createElement("div");
    div.textContent = i;

    const index = dates.children.length % 7;

    if (index === 0) div.classList.add("sun"); // 일요일
    if (index === 6) div.classList.add("sat"); // 토요일

    if (
      selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === i
    ) {
      div.classList.add("selected"); // ⭐ 오늘도 동일한 파란 원
    }

    div.addEventListener("click", () => {
      selectedDate = new Date(year, month, i);
      fn_selectPrgmDayFxList(DateLib.getDay(selectedDate, 'YYYY-MM-DD'));
      renderCalendar();
    });

    dates.appendChild(div);
    }

    // 다음 달
    const remain = 42 - dates.children.length;
    for (let i = 1; i <= remain; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    div.classList.add("other");
    dates.appendChild(div);
    }
  }

  prev.onclick = () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
  };

  next.onclick = () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
  };

  renderCalendar();
  //달력 script//////////////////////

  //메인화면 조회
  var mainPageNo = $("main").data("mainPageNumber");
  if(mainPageNo == "05"){
    fn_selectPrgmByDtyCdRegionNew();
    // 오늘날짜로 일간모집일정 조회
    fn_selectPrgmDayFxList(DateLib.getToday("YYYY-MM-DD"));
    //동영상 목록 조회(직업)
    //fn_selectVidoeByTypeNew('ALL'); //제외하기로함(월말, 2026.02.05)
    // 공지사항(xh_main.js에서 호출)
    fn_selectNoticePopData();
  }
})

/**
 * 직무, 지역 선택에 따른 값 설정 후 프로그램 목록 조회
 */
function fn_selectPrgmByDtyCdRegionNew(){
    $("#selectedDty").val($('input[name=rdo01]:checked').val());
    $("#selectedRegion").val($('input[name=rdo02]:checked').val());
    $("#pgrmCurrentPageNo").val('1');
    $("#prgmCardListNew").empty();
    fn_selectPgrmListNew();
}

/**
 * 직무 적용없이 닫기(상단X) 클릭시 원래의 값으로 재 설정
 */
function fn_CategoryPopCloseNew(){

  var val = $("#selectedDty").val();
  alert(val);
  $('input[type="radio"][name="rdo01"][value="12"]').checked = true;
}

/**
 * 프로그램 목록 조회 및 HTML생성
 */
function fn_selectPgrmListNew(onLoadGubn, mainPageNo){

    onSpinBlockUI();
    var pgrmType = $('#selectedPrgmType').val();
    var dtyCdChecked = $('input[name=rdo01]:checked').val();
    var areaCdChecked = $('input[name=rdo02]:checked').val();
    var currentPageNumber = $("#pgrmCurrentPageNo").val();
    var schOrderType = $("#selectedSchOrderType").val();

    var data = {prgmSecd: pgrmType, currentPageNo:currentPageNumber, dtyCd:dtyCdChecked, areaCd:areaCdChecked, schOrderType:schOrderType };
    var request = ComLib.ajaxReqObj(ComLib.c.CONTEXT_PATH + "/a/a/mainSelectRecentPrgmList.do",data);
    request.done(function(res, statusText, xhr) {
        if (!(res == undefined || res == null) && res.length > 0) {
            var _data = JSON.parse(res);
            var currentPageNo = Number(_data.currentPageNo)+1;
            if(!(_data.prgmMtcParam == null || _data.prgmMtcParam == "" || typeof _data.prgmMtcParam == "undefined" || _data.prgmMtcParam == undefined)){
                var dtyCd = _data.prgmMtcParam.dtyCd;
                var prgmSecd = _data.prgmMtcParam.prgmSecd;
                var areaCd = _data.prgmMtcParam.areaCd;
            }
            if(!(_data.prgmMtcParam == null || _data.prgmMtcParam == "" || typeof _data.prgmMtcParam == "undefined" || _data.prgmMtcParam == undefined)){
                var prgmTyDgnsYn= _data.prgmTyDgnsYn;
            }

            $("#dtyCd").val(dtyCd);
            $("#prgmSecd").val(prgmSecd);
            $("#areaCd").val(areaCd);
            if (_data.prneList != null && _data.prneList.length > 0) {

                $("#pgrmCurrentPageNo").val(currentPageNo);
                let prgmTag = "";
                for(let i=0; i < _data.prneList.length; i++){
                    prgmTag += '<li class="swiper-slide">';
                    prgmTag += '<div class="util-box">';
                    prgmTag += '<div class="tag-box">';
                    if(_data.prneList[i].prgmSecd =="I") {
                        prgmTag += '<span class="tag yellow">인턴형</span>';
                    } else if(_data.prneList[i].prgmSecd =="P") {
                        prgmTag += '<span class="tag red">프로젝트형</span>';
                    } else if(_data.prneList[i].prgmSecd =="E") {
                        prgmTag += '<span class="tag green">ESG지원형</span>';
                    } else if(_data.prneList[i].prgmSecd =="C") {
                        prgmTag += '<span class="tag blue">기업탐방형</span>';
                    }

                    if(_data.prneList[i].dDay < '0' ) {
                        prgmTag += '<span class="tag gray">마감</span>';
                    } else if(_data.prneList[i].dDay > '0') {
                        prgmTag += '<span class="tag gray">마감 D-'+_data.prneList[i].dDay+'</span>';
                    } else if(_data.prneList[i].dDay == '0') {
                        prgmTag += '<span class="tag gray">마감 D-DAY</span>';
                    }


                    prgmTag += '</div></div>';
                    prgmTag += '<p class="tit">'+_data.prneList[i].pgnm+'</p>';
                    prgmTag += '<p><span class="bold">모집기간</span><span>' + _data.prneList[i].rcitBgde + "~" + _data.prneList[i].rcitEnde + '</span></p>';
                    prgmTag += '<p><span class="bold">모집인원</span><span>' + _data.prneList[i].totlRcitNmpr + '명</span></p>';
                    prgmTag += '<p><span class="bold">모집직무</span><span>' + _data.prneList[i].dtyCdNm+ '</span></p>';
                    prgmTag += '<p><span class="bold">모집지역</span><span>' + _data.prneList[i].areaCdNm+ '</span></p>';
                    prgmTag += '<a href="javascript:fn_prgmDetail(\''+_data.prneList[i].prgmSecd+'\','+'\''+_data.prneList[i].untyPrgmCtn+'\');" title="'+_data.prneList[i].pgnm+'">자세히보기</a>'; //웹 접근성 추가
                    prgmTag += '</li>';


                }
                $("#prgmCardListNew").append(prgmTag);


            } else {
                prgmTag = '<div class="tbl"><div class="no-data" style="padding-bottom:0px !important; padding-top:28px !important"><div class="answer" style="display:inline-flex; gap:4px"><span style="margin-top: 3px">모집중인 일경험 프로그램이 없습니다.</span></div></div></div>'
                      $("#prgmCardListNew").append(prgmTag);
                      $("#prgmCardListNew").parent().next().css('display','none');
            }
        }
    });
}

/**
 * 프로그램 유형 설정
 */
function fn_selectPrgmByTypeNew(prgType, $this, mainPageNo){
    if(prgType == "ALL"){
        $("#selectedPrgmType").val("");
    } else {
        $("#selectedPrgmType").val(prgType);
    }
    $("#pgrmCurrentPageNo").val('1');
    $("#prgmCardListNew").empty();

    fn_selectPgrmListNew('',mainPageNo);
}

/**
 * 비디오 유형 설정
 */
function fn_selectVidoeByTypeNew(videoType, catCd1, catCd2){
    if(videoType == "ALL" || videoType == ""){
        $("#selectedvideoType").val("");
    } else {
        $("#selectedvideoType").val(videoType);
    }
    $("#videoCurrentPageNo").val('1');
    $("#jobVideoList").empty();

    fn_selectJobVideoList(videoType, catCd1, catCd2);
}


/**
 * 직업정보동영상 조회 및 HTML생성
 */
function fn_selectJobVideoList(videoType, catCd1, catCd2) {

  onSpinBlockUI();
  var data = {};
  var request = "";
  var data = { videoType: videoType, catCd1: catCd1, catCd2: catCd2 };

  if (videoType == "VR") {
    request = ComLib.ajaxReqObj(ComLib.c.CONTEXT_PATH + "/a/a/selectVrVideoByMain.do", data);
  } else {
    request = ComLib.ajaxReqObj(ComLib.c.CONTEXT_PATH + "/a/a/selectJobVideoByMain.do", data);
  }
  request.done(function(res, statusText, xhr) {
    if (!(res == undefined || res == null) && res.length > 0) {
      var _data = JSON.parse(res);
      var currentPageNo = Number(_data.currentPageNo) + 1;
      $("#videoCurrentPageNo").val(currentPageNo);

      //직업소개 동영상
      if (_data.videoCntsList != null && _data.videoCntsList.length > 0) {
        let videoTag = "";
        for (let i = 0; i < _data.videoCntsList.length; i++) {
          videoTag += '<div class="item swiper-slide">';
          if (videoType == "VR") {
            videoTag += '<a href="javascript:fn_occpVidoDetail(\''+videoType+'\','+'\''+ _data.videoCntsList[i].no +'\');" title="' +_data.videoCntsList[i].sbte+' '+_data.videoCntsList[i].subjt + '">';
            videoTag += '<div class="img-box">';
            videoTag += '<img src="' + _data.videoCntsList[i].imgUrla + '" alt="">';
            videoTag += '</div>';
            videoTag += '<p class="tit">' +_data.videoCntsList[i].sbte+' '+_data.videoCntsList[i].subjt + '</p>';
          } else {
            videoTag += '<a href="javascript:fn_occpVidoDetail(\''+videoType+'\','+'\''+_data.videoCntsList[i].movContSeq+'\');" title="' + _data.videoCntsList[i].title + '">';
            videoTag += '<div class="img-box">';
            videoTag += '<img src="' + _data.videoCntsList[i].thumbnailImg + '" alt="">';
            videoTag += '</div>';
            videoTag += '<p class="tit">' + _data.videoCntsList[i].title + '</p>';
          }
          videoTag += '<p class="shortcut">자세히보기</p>';
          videoTag += '</a>';
          videoTag += '</div>';
        }
        $("#jobVideoList").append(videoTag);
        if (videoType == "VR") {
          $("#jobVideoList").parent().next().attr("href", "/g/c/selectVrtlCntsList.do");
        } else {
          $("#jobVideoList").parent().next().attr("href", "/g/c/selectOccpVidoCntsList.do");
        }
      } else {
        let videoTag = "";
        videoTag += '<div class="tbl">';
        videoTag += '<div class="no-data" style="padding-bottom:0px !important; padding-top:28px !important">';
        videoTag += '<div class="answer" style="display:inline-flex; gap:4px">';
        videoTag += '<span style="margin-top: 3px">현재 등록된 영상 콘텐츠가 없습니다.</span>';
        videoTag += '</div>';
        videoTag += '</div>';
        videoTag += '</div>';
        $("#jobVideoList").append(videoTag);
        $("#jobVideoList").parent().next().css('display', 'none');
      }
    } else {
      let videoTag = "";
      videoTag += '<div class="tbl">';
      videoTag += '<div class="no-data" style="padding-bottom:0px !important; padding-top:28px !important">';
      videoTag += '<div class="answer" style="display:inline-flex; gap:4px">';
      videoTag += '<span style="margin-top: 3px">현재 등록된 영상 콘텐츠가 없습니다.</span>';
      videoTag += '</div>';
      videoTag += '</div>';
      videoTag += '</div>';
      $("#jobVideoList").append(videoTag);
      $("#jobVideoList").parent().next().css('display', 'none');
    }
  });
}

function fn_searchVideoLst(videoType, catCd1, catCd2) {
  onSpinBlockUI();
  console.log($('selectedvideoType').val());
  let $form = $('<form></form>');
  if (videoType == "VR") {
    $form.attr('action', ComLib.c.CONTEXT_PATH + '/g/c/selectVrtlCntsList.do');
  } else {
    $form.attr('action', ComLib.c.CONTEXT_PATH + '/g/c/selectOccpVidoCntsList.do');
  }
  $form.attr('method', 'POST');
  $form.appendTo('body');
  $form.submit();

}

function fn_occpVidoDetail(videoType, seq) {
  onSpinBlockUI();
  let $form = $('<form></form>');
  if (videoType == "VR") {
    var form = new FormLib.Form();
    form.createForm("vrtlCntsDtal", ComLib.c.CONTEXT_PATH + "/g/c/selectVrtlCntsDtal.do", "POST", null, null).addHidden("no", seq);
    form.addBody();
    ComLib.submit("vrtlCntsDtal");
  } else {
    var form = new FormLib.Form();
    form.createForm("occpVidoCntsDtal", ComLib.c.CONTEXT_PATH + "/g/c/selectOccpVidoCntsDtal.do", "POST", null, null).addHidden("movContSeq", seq);
    form.addBody();
    ComLib.submit("occpVidoCntsDtal");
  }
}

//메인화면 개편 NEW
function fn_selectPrgmBySchTypeNew(param){
    $("#selectedSchOrderType").val(param);
    $("#pgrmCurrentPageNo").val('1');
    $("#prgmCardListNew").empty();
    fn_selectPgrmListNew();
}

//프로그램 유형별 월간 목록 조회
//value => 선택된 코드 값, I, P, E, C, 전체는 빈값.
function fn_selectMonthScdu(value){
  console.log(value);
}

/**
 *  일경험 프로그램 일간 모집일정 조회
 */
function fn_selectPrgmDayFxList(currentDate, searchType){
    onSpinBlockUI();
    var prgmSecd = $("#prgmDayFxPrgmSecd").find("input:radio[name='prgmSecdRadio']:checked").val();
    var currentDate = currentDate;
    // 적용버튼을 누를 시 currentDate 값이 없음, searchType = A
    if (searchType == "A"){
      currentDate = DateLib.getDay(selectedDate, 'YYYY-MM-DD')
    }
    var data = {prgmSecd: prgmSecd, currentDate: currentDate};
    // 캘린더 하위의 row 초기화
    $(".calender-wrap .list-box .status-container").nextAll().remove();
    var request = ComLib.ajaxReqObj(ComLib.c.CONTEXT_PATH + "/a/a/selectPrgmDayFxListByMain.do",data);
    request.done(function(res, statusText, xhr) {
        if (!(res == undefined || res == null) && res.length > 0) {
            var _data = JSON.parse(res);
            }
            if (_data.selectPrgmDayFxList != null && _data.selectPrgmDayFxList.length > 0) {
                for(let i=0; i < _data.selectPrgmDayFxList.length; i++){
                    var prgmRow = "";
                    var status = _data.selectPrgmDayFxList[i].status;
                    var rcitBgde = _data.selectPrgmDayFxList[i].rcitBgde;
                    var rcitEnde = _data.selectPrgmDayFxList[i].rcitEnde;
                    var totAllCnt = _data.selectPrgmDayFxList[i].totAllCnt;
                    /*'XHDB00Service_selectWkexPrgmList'
                       유형 구분 : 1.시작일자
                                2.종료일자*/
                    if(status == "0"){
                        prgmRow += '<div class="list red">';
                    }else {
                        prgmRow += '<div class="list green">';
                     }
                    prgmRow += '<span class="dot"><i class="blind">';
                    if(status == "0"){
                        prgmRow += '모집 마감';
                    }else {
                        prgmRow += '모집 시작';
                     }
                    prgmRow += '</i></span>';
                    prgmRow += '<a href="javascript:fn_prgmDetail(\''+_data.selectPrgmDayFxList[i].prgmSecd+'\','+'\''+_data.selectPrgmDayFxList[i].untyPrgmCtn+'\')"; title="'+_data.selectPrgmDayFxList[i].pgnm+'">'; //웹 접근성 추가
                    prgmRow += _data.selectPrgmDayFxList[i].pgnm + '</a></div>';
                    // 상태값이 '모집시작'일땐 모집시작일이, '모집종료'일땐 모집종료일이 일치해야 요소 추가
                    if((status == '1' && rcitBgde == currentDate) || (status == '0' && rcitEnde == currentDate)) {
                        $("#prgmDayFxList").append(prgmRow);
                    }
                }
                // (totAllCnt)8건 초과일 경우 '더보기' 버튼 보임
                if(totAllCnt > 7){
                    // 더보기 버튼이 있을경우, 더보기 버튼이 생성될 만큼의 높이를 추가
                    $(".calender-wrap").css("height" , "88%");
                    // 조회된 8건을 더보기 숫자에서 제외
                    var moreBtnCnt = totAllCnt - 7
                    var moreBtn = '<a href="javascript:fn_PrgmDayFxList(\''+currentDate+'\')" class="more" title="월간 추진 일정 더보기">+<i>'+moreBtnCnt+'</i></a>';
                    $("#prgmDayFxList").append(moreBtn);
                } else {
                    $(".calender-wrap").css("height" , "auto");
                    $(".calender-wrap .list-box .more").empty();
                }

            } else {
                $(".calender-wrap").css("height" , "auto");
                prgmRow = '<div class="list" style="text-align: center; margin: 5px 0px;"><span class="no-content"><p>현재 일자에 모집 시작 또는 마감하는 프로그램이 없습니다.</p></span></div>'
                $("#prgmDayFxList").append(prgmRow);
            }
    })
};

/**
 * 일경험 프로그램 일간 모집 일정  currentDate
 */
function fn_PrgmDayFxList(currentDate){
    onSpinBlockUI();
    let $form = $('<form></form>');
    $form.attr('action', ComLib.c.CONTEXT_PATH +'/d/b/selectPrgmDayFxList.do');
    $form.attr('method', 'POST');
    $form.append($('<input />', {type:'hidden', name:'currentDate', value:currentDate}));
    $form.appendTo('body');
    $form.submit();
}
