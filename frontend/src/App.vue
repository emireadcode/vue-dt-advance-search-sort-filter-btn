<script setup lang="ts">
import AdvanceSearchSortAndFilter from './components/AdvanceSearchSortAndFilter.vue'

//npm install --save ol
//npm i date-fns
//npm i vue3-openlayers
</script>

<template>
  <AdvanceSearchSortAndFilter
    :config="{
      singlewordstringtypes: [
        {
          position: 1,
          name: 'CUSTOMER EMAIL',
          attribute: 'email',
          table: 'customer',
          enableincludeandexcludesearch: true,
          limit: 100
        },
        {
          position: 6,
          name: 'LANGUAGE',
          attribute: 'name',
          table: 'language',
          limit: 10
        },
        {
          position: 8,
          name: 'RATING',
          table: 'film',
          limit: 10
        }
      ],
      numberstringtypes: [
        {
          position: 2,
          name: 'CUSTOMER PHONE',
          attribute: 'phone',
          table: 'address',
          join: 'customer',
          limit: 100,
          enableincludeandexcludesearch: true,
          hasfixedlengthof: 11,
          enableatnumbersearch: true
        },
        {
          position: 3,
          name: 'STORE PHONE',
          attribute: 'phone',
          table: 'address',
          join: 'store',
          limit: 100,
          hasfixedlengthof: 11,
          enableatnumbersearch: true
        },
        {
          position: 18,
          name: 'CUSTOMER POSTAL CODE',
          attribute: 'postal_code',
          table: 'address',
          join: 'customer',
          limit: 100
        },
        {
          position: 23,
          name: 'CUSTOMER POSTAL PHONE CODE',
          limit: 100,
          concatenated: {
            fields: {
              0: {
                name: 'CUSTOMER POSTAL CODE',
                attribute: 'postal_code',
                table: 'address',
                join: 'customer',
                startmodifierwildcard: '+(',
                endmodifierwildcard: ')'
              },
              1: {
                name: 'CUSTOMER PHONE',
                attribute: 'phone',
                table: 'address',
                join: 'customer',
                enableincludeandexcludesearch: true,
                enableatnumbersearch: true

                /*name: 'POINT',
                attribute: 'geopoint',
                table: 'ITEMS_mysql_json_db',
                join: 'store',*/
              }
            },
            delimiters: ['']
          }
        },
        {
          position: 22,
          name: 'STORE POSTAL CODE',
          attribute: 'postal_code',
          table: 'address',
          join: 'store',
          limit: 100
        }
      ],
      multiplewordsstringtypes: [
        {
          position: 0,
          name: 'CUSTOMER NAME',
          limit: 100,
          concatenated: {
            fields: {
              0: {
                name: 'First Name',
                attribute: 'first_name',
                table: 'customer'
              },
              1: {
                name: 'Last Name',
                attribute: 'last_name',
                table: 'customer'
              }
            },
            delimiters: [' ']
          }
        },
        {
          position: 4,
          name: 'TITLE',
          table: 'film',
          limit: 100,
          enableincludeandexcludesearch: true
        },
        {
          position: 5,
          name: 'DESCRIPTION',
          table: 'film',
          limit: 100,
          enableincludeandexcludesearch: true
        },
        {
          position: 9,
          name: 'SPECIAL FEATURES',
          attribute: 'special_features',
          table: 'film',
          limit: 30,
          enableincludeandexcludesearch: true
        },
        {
          position: 20,
          name: 'CUSTOMER ADDRESS',
          limit: 100,
          concatenated: {
            fields: {
              0: {
                name: 'Address',
                table: 'address',
                join: 'customer',
                enableincludeandexcludesearch: true
              },
              1: {
                name: 'City',
                table: 'city',
                join: 'address'
              },
              2: {
                name: 'Country',
                table: 'country',
                join: 'city'
              }
            },
            delimiters: [', ', ', ']
          }
        },
        {
          position: 21,
          name: 'STORE ADDRESS',
          limit: 100,
          concatenated: {
            fields: {
              0: {
                name: 'Address',
                table: 'address',
                join: 'store',
                enableincludeandexcludesearch: true
              },
              1: {
                name: 'City',
                table: 'city',
                join: 'address',
                enableincludeandexcludesearch: false
              },
              2: {
                name: 'Country',
                table: 'country',
                join: 'city',
                enableincludeandexcludesearch: false
              }
            },
            delimiters: [', ']
          }
        }
      ],
      datetypes: [
        {
          position: 10,
          name: 'PAYMENT DATE',
          attribute: 'payment_date',
          table: 'payment',
          limit: 10,
          dateFormat: 'ddd dd mmm, yyyy',
          isoweek: false
        }
      ],
      /*timetypes: [
        {
          position: 19,
          name: 'VISITED TIME',
          attribute: 'visited_time',
          table: 'payment',
          limit: 10,
          timeFormat: '12-HCWOSWLZ'
        }
      ],*/
      datetimetypes: [
        {
          position: 11,
          name: 'CUSTOMER CREATED DATE',
          attribute: 'create_date',
          table: 'customer',
          limit: 10,
          dateFormat: 'dd-mm-yyyy',
          timeFormat: '12-HCWOSWOLZ',
          isoweek: true
        }
      ],
      numbertypes: [
        {
          position: 12,
          name: 'AMOUNT',
          table: 'payment',
          limit: 10
        },
        /*{
          position: 25,
          name: 'POINT',
          attribute: 'geopoint',
          table: 'ITEMS_sakila',
          join: 'store',
          limit: 10
        },
        {
          position: 24,
          name: 'POINT1',
          attribute: 'geopoint',
          table: 'ITEMS_mysql_json_db',
          join: 'store',
          limit: 10
        },*/
        {
          position: 7,
          name: 'RENTAL RATE',
          attribute: 'rental_rate',
          table: 'film',
          limit: 50
        },
        {
          position: 13,
          name: 'LENGTH',
          table: 'film',
          limit: 10
        },
        {
          position: 14,
          name: 'REPLACEMENT COST',
          attribute: 'replacement_cost',
          table: 'film',
          limit: 7
        },
        {
          position: 16,
          name: 'RENTAL DURATION',
          attribute: 'rental_duration',
          table: 'film',
          limit: 100
        }
      ],
      yeartypes: [
        {
          position: 15,
          name: 'RELEASE YEAR',
          attribute: 'release_year',
          table: 'film',
          limit: 8
        }
      ],
      /*jsontypes: [
        {
          position: 26,
          name: 'MEDICAL APPOINTMENT',
          attribute: 'arbitraryjsonvalues',
          table: 'ITEMS_mysql_json_db',
          join: 'store',
          limit: 500,
        },
      ],*/
      keytonamemappingtypes: [
        {
          position: 17,
          name: 'CUSTOMER STATUS',
          attribute: 'active',
          table: 'customer',
          limit: 10,
          keytonamemapping: {
            1: 'Active',
            0: 'Disable'
          }
        }
      ]
    }"
  ></AdvanceSearchSortAndFilter>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
footer,
header,
nav,
section {
  display: block;
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff;
}
[tabindex='-1']:focus:not(:focus-visible) {
  outline: 0 !important;
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
}
ul {
  margin-top: 0;
  margin-bottom: 1rem;
}
ul ul {
  margin-bottom: 0;
}
a {
  text-decoration: none;
  background-color: transparent;
}
a:hover {
  text-decoration: underline;
}
a:not([href]):not([class]) {
  color: inherit;
  text-decoration: none;
}
a:not([href]):not([class]):hover {
  color: inherit;
  text-decoration: none;
}
img {
  vertical-align: middle;
  border-style: none;
}
svg {
  overflow: hidden;
  vertical-align: middle;
}
table {
  border-collapse: collapse;
}
caption {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #6c757d;
  text-align: left;
  caption-side: bottom;
}
th {
  text-align: inherit;
}
label {
  display: inline-block;
}
button {
  border-radius: 0;
}
button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}
button,
input {
  overflow: visible;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
button {
  text-transform: none;
}
[role='button'] {
  cursor: pointer;
}
button:not(:disabled),
[type='button']:not(:disabled),
[type='reset']:not(:disabled),
[type='submit']:not(:disabled) {
  cursor: pointer;
}
button::-moz-focus-inner,
[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner {
  padding: 0;
  border-style: none;
}
input[type='radio'],
input[type='checkbox'] {
  box-sizing: border-box;
  padding: 0 !important;
  margin: 0 !important;
}
[type='number']::-webkit-inner-spin-button,
[type='number']::-webkit-outer-spin-button {
  height: auto;
}
[type='search'] {
  outline-offset: -2px;
}
[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button;
}
template {
  display: none;
}
[hidden] {
  display: none !important;
}
input[type='text'] {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  border: 0;
  background-color: #fff;
  background-clip: padding-box;
  outline: 1px solid rgba(0, 0, 0, 0.2);
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  input[type='text'] {
    transition: none;
  }
}
input[type='text']::-ms-expand {
  background-color: transparent;
  border: 0;
}
input[type='text']:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #495057;
}
input[type='text']:focus {
  color: #495057;
  background-color: #fff;
  outline-color: #80bdff;
  border: 0;
  box-shadow: 0 0 0 0.115rem rgba(0, 123, 255, 0.25);
  z-index: 1200;
}
input[type='text']::-webkit-input-placeholder {
  color: #6c757d;
  opacity: 1;
}
input[type='text']::-moz-placeholder {
  color: #6c757d;
  opacity: 1;
}
input[type='text']:-ms-input-placeholder {
  color: #6c757d;
  opacity: 1;
}
input[type='text']::-ms-input-placeholder {
  color: #6c757d;
  opacity: 1;
}
input[type='text']::placeholder {
  color: #6c757d;
  opacity: 1;
}
input[type='text']:disabled,
input[type='text'][readonly] {
  background-color: #e9ecef;
  opacity: 1;
}
.cursor-pointer {
  cursor: pointer !important;
}
.cursor-disabled {
  cursor: not-allowed !important;
}
.position-absolute {
  position: absolute !important;
}
.position-relative {
  position: relative !important;
}
.position-fixed {
  position: fixed !important;
}
.w-50 {
  width: 50% !important;
}
.w-100 {
  width: 100% !important;
}
.h-100 {
  height: 100% !important;
}
.vh-100 {
  height: 100vh !important;
}
.height-auto {
  height: auto !important;
}
.m-0 {
  margin: 0 !important;
}
.p-0 {
  padding: 0 !important;
}
.t-0 {
  top: 0 !important;
}
.l-0 {
  left: 0 !important;
}
.align-middle {
  vertical-align: middle !important;
}
.text-center {
  text-align: center !important;
}
.text-left {
  text-align: left !important;
}
.text-right {
  text-align: right !important;
}
.justify-content-center {
  justify-content: center !important;
}
.align-items-start {
  -ms-flex-align: start !important;
  align-items: flex-start !important;
}
.align-items-center {
  align-items: center !important;
}
.shadow {
  box-shadow:
    0 0.46667rem 0.991667rem 0 rgba(0, 0, 0, 0.2),
    0 0.35rem 1.16667rem 0 rgba(0, 0, 0, 0.19);
}
.shadow-sm {
  box-shadow:
    rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}
.user-select-none,
.btn {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
.d-none {
  display: none !important;
}
.d-inline-block {
  display: -moz-inline-stack;
  display: inline-block !important;
  zoom: 1;
}
.overflow-hidden {
  overflow: hidden !important;
}
.overflow-auto {
  overflow: auto !important;
}
.overflow-y-auto {
  overflow-y: auto !important;
}
.overflow-x-hidden {
  overflow-x: hidden !important;
}
.overflow-x-scroll {
  overflow-x: scroll !important;
}
.underline-none {
  text-decoration: none !important;
}
.text-break {
  word-break: break-word !important;
  overflow-wrap: break-word !important;
}
.text-wrap {
  white-space: normal !important;
}
.text-lowercase {
  text-transform: lowercase !important;
}
.text-uppercase {
  text-transform: uppercase !important;
}
.text-capitalize {
  text-transform: capitalize !important;
}
.flex-box {
  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
  display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
  display: -ms-flexbox; /* TWEENER - IE 10 */
  display: -webkit-flex; /* NEW - Chrome */
  display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-direction-row {
  -ms-flex-direction: row !important;
  flex-direction: row !important;
}
.flex-nowrap {
  -ms-flex-wrap: nowrap !important;
  flex-wrap: nowrap !important;
}
.flex-wrap {
  -ms-flex-wrap: wrap !important;
  flex-wrap: wrap !important;
}
.flex-w-10 {
  -webkit-box-flex: 0 0 10%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 10%; /* OLD - Firefox 19- */
  width: 10%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 10%; /* Chrome */
  -ms-flex: 0 0 10%; /* IE 10 */
  flex: 0 0 10%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-12-dot-5 {
  -webkit-box-flex: 0 0 12.5%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 12.5%; /* OLD - Firefox 19- */
  width: 12.5%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 12.5%; /* Chrome */
  -ms-flex: 0 0 12.5%; /* IE 10 */
  flex: 0 0 12.5%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-14-dot-285714 {
  -webkit-box-flex: 0 0 14.285714%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 14.285714%; /* OLD - Firefox 19- */
  width: 14.285714%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 14.285714%; /* Chrome */
  -ms-flex: 0 0 14.285714%; /* IE 10 */
  flex: 0 0 14.285714%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-20 {
  -webkit-box-flex: 0 0 20%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 20%; /* OLD - Firefox 19- */
  width: 20%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 20%; /* Chrome */
  -ms-flex: 0 0 20%; /* IE 10 */
  flex: 0 0 20%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-25 {
  -webkit-box-flex: 0 0 25%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 25%; /* OLD - Firefox 19- */
  width: 25%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 25%; /* Chrome */
  -ms-flex: 0 0 25%; /* IE 10 */
  flex: 0 0 25%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-24-rem {
  -webkit-box-flex: 0 0 5rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 5rem; /* OLD - Firefox 19- */
  width: 5rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 5rem; /* Chrome */
  -ms-flex: 0 0 5rem; /* IE 10 */
  flex: 0 0 5rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-100-over-3 {
  -webkit-box-flex: 0 0 33.333333333%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 33.333333333%; /* OLD - Firefox 19- */
  width: 33.333333333%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 33.333333333%; /* Chrome */
  -ms-flex: 0 0 33.333333333%; /* IE 10 */
  flex: 0 0 33.333333333%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-100-over-6 {
  -webkit-box-flex: 0 0 16.666666667%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 16.666666667%; /* OLD - Firefox 19- */
  width: 16.666666667%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 16.666666667%; /* Chrome */
  -ms-flex: 0 0 16.666666667%; /* IE 10 */
  flex: 0 0 16.666666667%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-40 {
  -webkit-box-flex: 0 0 40%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 40%; /* OLD - Firefox 19- */
  width: 40%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 40%; /* Chrome */
  -ms-flex: 0 0 40%; /* IE 10 */
  flex: 0 0 40%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-50 {
  -webkit-box-flex: 0 0 50%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 50%; /* OLD - Firefox 19- */
  width: 50%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 50%; /* Chrome */
  -ms-flex: 0 0 50%; /* IE 10 */
  flex: 0 0 50%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-60 {
  -webkit-box-flex: 0 0 60%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 60%; /* OLD - Firefox 19- */
  width: 60%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 60%; /* Chrome */
  -ms-flex: 0 0 60%; /* IE 10 */
  flex: 0 0 60%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-80 {
  -webkit-box-flex: 0 0 80%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 80%; /* OLD - Firefox 19- */
  width: 80%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 80%; /* Chrome */
  -ms-flex: 0 0 80%; /* IE 10 */
  flex: 0 0 80%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-100 {
  -webkit-box-flex: 0 0 100%; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 100%; /* OLD - Firefox 19- */
  width: 100%; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 100%; /* Chrome */
  -ms-flex: 0 0 100%; /* IE 10 */
  flex: 0 0 100%; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-1-dot-75-rem {
  -webkit-box-flex: 0 0 1.75rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 1.75rem; /* OLD - Firefox 19- */
  width: 1.75rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 1.75rem; /* Chrome */
  -ms-flex: 0 0 1.75rem; /* IE 10 */
  flex: 0 0 1.75rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-3-dot-5-rem {
  -webkit-box-flex: 0 0 3.5rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 3.5rem; /* OLD - Firefox 19- */
  width: 3.5rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 3.5rem; /* Chrome */
  -ms-flex: 0 0 3.5rem; /* IE 10 */
  flex: 0 0 3.5rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-5-dot-25-rem {
  -webkit-box-flex: 0 0 5.25rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 5.25rem; /* OLD - Firefox 19- */
  width: 5.25rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 5.25rem; /* Chrome */
  -ms-flex: 0 0 5.25rem; /* IE 10 */
  flex: 0 0 5.25rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-6-dot-25-rem {
  -webkit-box-flex: 0 0 6.25rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 6.25rem; /* OLD - Firefox 19- */
  width: 6.25rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 6.25rem; /* Chrome */
  -ms-flex: 0 0 6.25rem; /* IE 10 */
  flex: 0 0 6.25rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-8-rem {
  -webkit-box-flex: 0 0 8rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 8rem; /* OLD - Firefox 19- */
  width: 8rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 8rem; /* Chrome */
  -ms-flex: 0 0 8rem; /* IE 10 */
  flex: 0 0 8rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-10-rem {
  -webkit-box-flex: 0 0 10rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 10rem; /* OLD - Firefox 19- */
  width: 10rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 10rem; /* Chrome */
  -ms-flex: 0 0 10rem; /* IE 10 */
  flex: 0 0 10rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex-w-16-rem {
  -webkit-box-flex: 0 0 16rem; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 0 0 16rem; /* OLD - Firefox 19- */
  width: 16rem; /* For old syntax, otherwise collapses. */
  -webkit-flex: 0 0 16rem; /* Chrome */
  -ms-flex: 0 0 16rem; /* IE 10 */
  flex: 0 0 16rem; /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.justify-content-start {
  -ms-flex-pack: start !important;
  justify-content: flex-start !important;
}
.justify-content-end {
  -ms-flex-pack: end !important;
  justify-content: flex-end !important;
}
.align-self-stretch {
  align-self: stretch !important;
}
.flex-fill {
  -ms-flex: 1 1 auto !important;
  flex: 1 1 auto !important;
}
.flex-grow-1 {
  -ms-flex-positive: 1 !important;
  flex-grow: 1 !important;
}
.flex-shrink-1 {
  -ms-flex-negative: 1 !important;
  flex-shrink: 1 !important;
}
.flex-grow-0 {
  -ms-flex-positive: 0 !important;
  flex-grow: 0 !important;
}
.flex-shrink-0 {
  -ms-flex-negative: 0 !important;
  flex-shrink: 0 !important;
}
.list-style-none {
  list-style: none !important;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -moz-binding: url('/src/assets/xml/ellipsis.xml#ellipsis');
}
.btn {
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
.btn:hover {
  color: #212529;
  text-decoration: none;
}
.btn:focus,
.btn.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.btn.disabled,
.btn:disabled {
  opacity: 0.65;
}
.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
}
a.btn.disabled {
  pointer-events: none;
}
.d-block {
  display: block !important;
}
.wh-1-dot-25-rem {
  width: 1.25rem !important;
  height: 1.25rem !important;
}
.wh-1-dot-5-rem {
  width: 1.5rem !important;
  height: 1.5rem !important;
}
.wh-1-dot-75-rem {
  width: 1.75rem !important;
  height: 1.75rem !important;
}
.letter-spacing {
  letter-spacing: 0.0583333333333rem;
}
.font-bold {
  font-weight: bold;
}
.font-0-dot-70-rem {
  font-size: 0.7rem !important;
}
.font-0-dot-80-rem {
  font-size: 0.8rem !important;
}
.font-0-dot-85-rem {
  font-size: 0.85rem !important;
}
.font-0-dot-875-rem {
  font-size: 0.875rem !important;
}
.font-0-dot-90-rem {
  font-size: 0.9rem !important;
}
.border-black {
  border: 1px solid black;
}
.font-family {
  font-family: -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen, ubuntu, cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
