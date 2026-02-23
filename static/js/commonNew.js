document.addEventListener('DOMContentLoaded', function() {

    const mobileGnbWrap = document.querySelector('.mobile-gnb-wrap');
    const mobileMenu = document.querySelectorAll('button.all-menu');
    const headerNewNavWrap = document.querySelector('.nav-wrap');
    const mobileClose = document.querySelector('.mobile-close');
    const headerNew = document.querySelector('#header-new');
    const mobUtil = document.querySelector('.mob-util');

    // GNB - MOBILE
    function mobileGnb(){
     document.querySelectorAll('.mobile-gnb .depth1 > li.depth1-item').forEach(li => {
       const link = li.querySelector('a');
       if(!link) return;

       const isExpanded = li.classList.contains('is-expanded');

       // 1. 모바일 모드 > 전체메뉴 이동 시 이전의 선택 메뉴정보 전달
       if(isExpanded){
         link.classList.add('active');
       } else {
         link.classList.remove('active');
       }
         link.setAttribute('aria-expanded', isExpanded);
       });

       // 2. active, aria-expanded 제어 이벤트 리스너 추가
        const mobilegnbDepth1Items = document.querySelectorAll('.mobile-gnb .depth1-item > a');
        mobilegnbDepth1Items.forEach(item => {
            item.addEventListener('click', function(){
                if(!item.classList.contains('active')){
                    // active 클래스, aria-expanded 속성 초기화
                    mobilegnbDepth1Items.forEach(btn => {
                      btn.classList.remove('active');
                      btn.setAttribute('aria-expanded', false);
                      btn.closest('li.depth1-item').classList.remove('is-expanded');
                    });

                    // 현재 클릭한 항목에만 active 추가
                    item.classList.add('active');
                    item.setAttribute('aria-expanded', true);
                    item.closest('li.depth1-item').classList.add('is-expanded');
                } else{
                    item.classList.remove('active');
                    item.setAttribute('aria-expanded', false);
                    item.closest('li.depth1-item').classList.remove('is-expanded');
                }
            });
        });
    }
    mobileGnb();

    /* 모바일 메뉴 클릭할 시
     * 모바일 > 전체메뉴 클릭 시 메뉴 깨짐 수정
     */
    function openMobileWrap(){
            mobileMenu.forEach(btn => {
                btn.addEventListener('click', function(){
                  // close -> open
                  mobUtil.setAttribute("style", "display: block");

                  // 모바일 전체메뉴 오픈할 시 class 제어
                  headerNew.classList.add('open');
                  mobileGnbWrap.classList.add('open');
                  headerNewNavWrap.classList.add('open');

                  document.querySelector('body').classList.add('noScroll');
                  setMobileGnbFocusTrap();
                });
            });
        }
      openMobileWrap();

      function closeMobileWrap(){
          mobileClose.addEventListener('click', function(){
              mobUtil.setAttribute("style", "display: none");
              headerNew.classList.remove('open');
              mobileGnbWrap.classList.remove('open');
              headerNewNavWrap.classList.remove('open');

              document.querySelector('body').classList.remove('noScroll');
              removeMobileGnbFocusTrap();
            });
        }
        closeMobileWrap();

    // 윈도우 리사이즈 시 모바일/PC 초기화
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        // PC
        if (width > 1025) {
            mobUtil.setAttribute("style", "display: none");
            headerNew.classList.remove('open');
            mobileGnbWrap.classList.remove('open');
            headerNewNavWrap.classList.remove('open');
            document.querySelector('body').classList.remove('noScroll');
            removeMobileGnbFocusTrap();

        // TABLET, MOBILE
        } else {
           if(headerNew.classList.contains('open')) {
             mobUtil.setAttribute("style", "display: block");
             headerNew.classList.add('open');
             mobileGnbWrap.classList.add('open');
             headerNewNavWrap.classList.add('open');
             document.querySelector('body').classList.add('noScroll');
             setMobileGnbFocusTrap();
           }
        }
    });

    // 모바일 전체메뉴 웹접근성 개선: 포커스 트랩 및 첫 포커스 이동
    function setMobileGnbFocusTrap() {
        const focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

        setTimeout(() => {
            const focusableElements = Array.from(mobileGnbWrap.querySelectorAll(focusableSelectors))
                .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

            if (focusableElements.length === 0) return;

            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            function trapFocus(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            }

            // 기존 이벤트 제거 후 재등록(중복 방지)
            if (mobileGnbWrap._trapFocusHandler) {
                mobileGnbWrap.removeEventListener('keydown', mobileGnbWrap._trapFocusHandler);
            }
            mobileGnbWrap.addEventListener('keydown', trapFocus);
            mobileGnbWrap._trapFocusHandler = trapFocus;

            // 첫번째 포커스 요소로 이동 (닫기버튼이 아닌 메뉴 첫 요소)
            firstFocusable.focus();
        }, 2000); // 닫기버튼 DOM 추가 후 확실히 실행
    }

    // 포커스 트랩 해제
    function removeMobileGnbFocusTrap() {
        if (mobileGnbWrap._trapFocusHandler) {
            mobileGnbWrap.removeEventListener('keydown', mobileGnbWrap._trapFocusHandler);
            mobileGnbWrap._trapFocusHandler = null;
        }
    }



    // 검색창 히스토리 영역 활성화 제어
    (function() {
        const srchWrap = document.querySelector('.srch-wrap');
        const inpWrap = srchWrap ? srchWrap.querySelector('.inp-wrap') : null;
        const searchInput = inpWrap ? inpWrap.querySelector('.inp') : null;
        const historyArea = srchWrap ? srchWrap.querySelector('.history-area') : null;

        if (!inpWrap || !searchInput || !historyArea) return;

        // input에 포커스하거나 inpWrap에 마우스 오버하면 history-area 활성화
        function openHistory() {
            //입력창에 글자가 없을 때만 호출하게 한다. 자동완성과 레이어가 겹침.
            var searchInputVal = $("#totalSearch").val().trim();
            if(searchInputVal == "") {
                historyArea.classList.add('active');
            }
        }

        // 외부 클릭 시 닫기
        function onDocClick(e) {
            if (!inpWrap.contains(e.target) && !historyArea.contains(e.target)) {
                historyArea.classList.remove('active');
            }
        }

        searchInput.addEventListener('focus', openHistory);
        searchInput.addEventListener('click', openHistory);

        // 문서 클릭으로 외부 클릭 처리
        document.addEventListener('click', onDocClick);

        // 히스토리 영역 내부에서 클릭해도 닫히지 않게 stopPropagation (선택적)
        historyArea.addEventListener('click', function(e){
            e.stopPropagation();
        });

        // 키보드로 탭 이동 시, history-area 내부의 포커스 가능한 요소들을 체크해서
        // 마지막 요소에서 Tab(Shift 없는) 누르면 history-area 닫기
        function getFocusableElements(container) {
            return Array.from(container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
                .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
        }

        historyArea.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            const focusables = getFocusableElements(historyArea);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            // Tab forward on last element -> close history
            if (!e.shiftKey && document.activeElement === last) {
                // allow the browser to move focus (which will go outside), then close
                setTimeout(() => {
                    historyArea.classList.remove('active');
                }, 0);
            }

            // Shift+Tab on first element -> close (focus moves outside backwards)
            if (e.shiftKey && document.activeElement === first) {
                setTimeout(() => {
                    historyArea.classList.remove('active');
                }, 0);
            }
        });

        // 보조: focusout으로 포커스가 historyArea 밖으로 완전히 옮겨가면 닫기
        historyArea.addEventListener('focusout', function() {
            // nextTick에서 document.activeElement를 검사
            setTimeout(() => {
                const active = document.activeElement;
                if (!historyArea.contains(active) && !inpWrap.contains(active)) {
                    historyArea.classList.remove('active');
                }
            }, 0);
        });
    })();


    // 패밀리 사이트
    const btnFamilySite = document.querySelectorAll('.family-site-button');
    const familySiteList = document.querySelectorAll('.family-site-list');
    const familySiteWrap = document.querySelectorAll('.family-site-wrap');

    btnFamilySite.forEach((openBtn, i) => {
        openBtn.setAttribute("aria-expanded", "false"); //웹접근성 추가 i_jes
        openBtn.addEventListener('click', function () {
            const isActive = familySiteList[i].classList.contains('active');

            familySiteList.forEach(list =>
                list.classList.remove('active')
            );
            if (!isActive) {
                familySiteList[i].classList.add('active');
                openBtn.classList.add('active');
                openBtn.title = '닫기';
                openBtn.setAttribute("aria-expanded", "true");//웹접근성 추가 i_jes
            } else {
                openBtn.classList.remove('active');
                openBtn.title = '열기';
                openBtn.setAttribute("aria-expanded", "false");//웹접근성 추가 i_jes
            }
        });
    });

    // 251219 다른 영역 클릭 시 패밀리사이트 닫기 (ej)
    document.addEventListener('click', (e) => {

        familySiteWrap.forEach((wrap, i) => {
            if (!wrap.contains(e.target)) {
                familySiteList[i].classList.remove('active');
                btnFamilySite[i].classList.remove('active');
                btnFamilySite[i].title = '열기';
            }
        });
    });



    /* 251014 웹 접근성 품질개선 - input/textarea.inp 지우기 버튼 동적 생성 (ej) */
    // input.inp, textarea.inp 옆에 지우기 버튼 동적 추가
    document.querySelectorAll('input.inp, textarea.inp').forEach(function(inp) {
        // 이미 버튼이 있으면 중복 추가 방지
        if (!inp.parentNode.querySelector('.form-control-clear')) {
            var clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'form-control-clear hidden';
            clearBtn.textContent = '지우기';
            // input 바로 뒤에 삽입
            inp.parentNode.insertBefore(clearBtn, inp.nextSibling);

            // 버튼 클릭 시 입력값 삭제 및 포커스
            clearBtn.addEventListener('click', function() {
                inp.value = '';
                clearBtn.classList.add('hidden');
                inp.focus();
                // 필요시 input 이벤트도 발생
                var event = new Event('input', { bubbles: true });
                inp.dispatchEvent(event);
            });
        }
    });

    // 입력값 있을 때만 버튼 노출
    function toggleClearButton(e) {
        var inp = e.target;
        var clearBtn = inp.parentNode.querySelector('.form-control-clear');
        if (!clearBtn) return;
        if (inp.value) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    document.querySelectorAll('input.inp, textarea.inp').forEach(function(inp) {
        inp.addEventListener('input', toggleClearButton);
        // 초기 상태 반영
        toggleClearButton({ target: inp });
    });
    /* // 251014 웹 접근성 품질개선 - input/textarea.inp 지우기 버튼 동적 생성 (ej) */


    // 251219 다른 영역 클릭 시 패밀리사이트 닫기 (ej)

});