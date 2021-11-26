# 웹앱의 구성요소

일반적인 구성요소 : HTML , CSS, Javascript

## HTML

단순 웹페이지의 구성

## CSS

페이지를 꾸며주는 역할

## JavaScript

웹앱의 필수 불가결한 요소, 페이지를 동작할 수 있게 만들어줌

HTML + CSS ⇒ 정적인 역할을 하는 문서 (웹 앱 x)

웹앱 : 사용자와 인터렉티브 하게 동작하는것

웹앱의 실행이란? : 사용자가 브라우저의 실행 이후, 주소 입력, 접속 후, html , js, css 가 사용자의 브라우저에 전송되어, 브라우저가 파일을 해석하여 실행 → 웹앱의 동작

HTML : UI 생성

CSS : UI의 디자인적 요소를 담당

Javascript : 웹앱의 동적인 요소 담당

브라우저 : 웹 앱을 실행시키는 역할 → 실행되는 시간 → 런타임환경을 제공하는 환경

옛날 브라우저만 Javascript 를 실행시키는데 node.js의 등장으로 js의 별개로 실행시킬 수 있게 되었다.

웹앱을 실행시키는것은 브라우저만이 아니다.

UI를 만드는 역할은 HTML

Javascirpt는 HTML을 조작이 가능하다.

# Client Side Rendering (CSR)

브라우저에서 Javascript의 실행의 결과로 HTML UI가 주도적으로 만들어지는 것

# Server Side Rendering (SSR)

웹 서버에서 UI를 만들어 브라우저에 전송하는 방법

CSR vs SSR

개발 목표에 따라 CSR 과 SSR을 적절히 조절하여 적용해야 된다.

# 그래픽 시스템

기존 : HTML , CSS 를 통해 그래픽을 표현

Chart , Animation , 3D 로는 한계 → Javascript의 <캔버스 태그> 를 통해 활용 

벡터나 SVG를 구현하는는법은 추후에 배울 것!

웹앱의 추가적인 요소 : 미디어파일, 웹 워커, 웹 어셈블리 등등...