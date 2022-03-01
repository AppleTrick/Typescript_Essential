## 식별자란?

**식별자**는 코드 내의 [변수](https://developer.mozilla.org/ko/docs/Glossary/Variable), [함수](https://developer.mozilla.org/ko/docs/Glossary/Function), 혹은 [속성 (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/property)을 식별하는 문자열입니다.

[JavaScript](https://developer.mozilla.org/ko/docs/Glossary/JavaScript)의 식별자는 대소문자를 구별하며 [유니코드](https://developer.mozilla.org/ko/docs/Glossary/Unicode) 글자, `$`, `_`, 숫자(0-9)로 구성할 수 있지만, 숫자로 시작할 수는 없습니다.

식별자는 코드의 일부이지만 문자열은 데이터이기 때문에, 식별자와 문자열은 다릅니다. JavaScript에서 식별자를 문자열로 변환하는 방법은 없지만, 어떤 경우 문자열을 분석해 식별자로 사용할 수 있습니다.

## 변수명

```tsx
let age = 10;
```

## 함수명

```tsx
function setAge(){

}
```

## 객체명

```tsx
const o = {
	age : 20,
	['123my Name'] : 'park',
}
```

객체로 생성할때도 식별자 코드 규칙을 지키지만 [’123my Name’] 같이 문자열을 식별자로 바꾸어서 접근도 가능하다.

```tsx
o.age
o['123my Name']
```

접근할때 위와 같은 방법으로 접근하면 된다.

## 식별자 관습

- 상수는 대부분은 대문자로 명명한다.

```tsx
const YEAR = 2022;
```

- 단어가 길어질 경우
    - 첫단어는 소문자 두번째는 단어부터는 대문자인 카멜케이스 표기법
        
        ```tsx
        const songpaEmart = "송파이마트";
        ```
        
    - 단어와 단어 사이를 _ 로 구분하는 스네이크 표기법이 있다.
        
        ```tsx
        const songpa_emart = "송파이마트";
        ```