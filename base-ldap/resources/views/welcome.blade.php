<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
<!--[if IE]><link rel="icon" href="{{ asset('favicon.ico') }}"><![endif]-->
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('icons/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('icons/favicon-16x16.png') }}">
    <meta name="theme-color" content="#ffffff">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">
    <link rel="apple-touch-icon" href="{{ asset('icons/apple-touch-icon-152x152.png') }}">
    <link rel="mask-icon" href="{{ asset('icons/safari-pinned-tab.svg') }}" color="#ffffff">
    <meta name="msapplication-TileImage" content="{{ asset('icons/msapplication-icon-144x144.png') }}">
    <meta name="msapplication-TileColor" content="#594d95">

    <title>{{ config('app.name') }}</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

    <!-- Styles -->
    <style>
        /*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}a{background-color:transparent}[hidden]{display:none}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}*,:after,:before{box-sizing:border-box;border:0 solid #e2e8f0}a{color:inherit;text-decoration:inherit}svg,video{display:block;vertical-align:middle}video{max-width:100%;height:auto}.bg-white{--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity))}.bg-gray-100{--bg-opacity:1;background-color:#f7fafc;background-color:rgba(247,250,252,var(--bg-opacity))}.border-gray-200{--border-opacity:1;border-color:#edf2f7;border-color:rgba(237,242,247,var(--border-opacity))}.border-t{border-top-width:1px}.flex{display:flex}.grid{display:grid}.hidden{display:none}.items-center{align-items:center}.justify-center{justify-content:center}.font-semibold{font-weight:600}.h-5{height:1.25rem}.h-8{height:2rem}.h-16{height:4rem}.text-sm{font-size:.875rem}.text-lg{font-size:1.125rem}.leading-7{line-height:1.75rem}.mx-auto{margin-left:auto;margin-right:auto}.ml-1{margin-left:.25rem}.mt-2{margin-top:.5rem}.mr-2{margin-right:.5rem}.ml-2{margin-left:.5rem}.mt-4{margin-top:1rem}.ml-4{margin-left:1rem}.mt-8{margin-top:2rem}.ml-12{margin-left:3rem}.-mt-px{margin-top:-1px}.max-w-6xl{max-width:72rem}.min-h-screen{min-height:100vh}.overflow-hidden{overflow:hidden}.p-6{padding:1.5rem}.py-4{padding-top:1rem;padding-bottom:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.pt-8{padding-top:2rem}.fixed{position:fixed}.relative{position:relative}.top-0{top:0}.right-0{right:0}.shadow{box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)}.text-center{text-align:center}.text-gray-200{--text-opacity:1;color:#edf2f7;color:rgba(237,242,247,var(--text-opacity))}.text-gray-300{--text-opacity:1;color:#e2e8f0;color:rgba(226,232,240,var(--text-opacity))}.text-gray-400{--text-opacity:1;color:#cbd5e0;color:rgba(203,213,224,var(--text-opacity))}.text-gray-500{--text-opacity:1;color:#a0aec0;color:rgba(160,174,192,var(--text-opacity))}.text-gray-600{--text-opacity:1;color:#718096;color:rgba(113,128,150,var(--text-opacity))}.text-gray-700{--text-opacity:1;color:#4a5568;color:rgba(74,85,104,var(--text-opacity))}.text-gray-900{--text-opacity:1;color:#1a202c;color:rgba(26,32,44,var(--text-opacity))}.underline{text-decoration:underline}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.w-5{width:1.25rem}.w-8{width:2rem}.w-auto{width:auto}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}@media (min-width:640px){.sm\:rounded-lg{border-radius:.5rem}.sm\:block{display:block}.sm\:items-center{align-items:center}.sm\:justify-start{justify-content:flex-start}.sm\:justify-between{justify-content:space-between}.sm\:h-20{height:5rem}.sm\:ml-0{margin-left:0}.sm\:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\:pt-0{padding-top:0}.sm\:text-left{text-align:left}.sm\:text-right{text-align:right}}@media (min-width:768px){.md\:border-t-0{border-top-width:0}.md\:border-l{border-left-width:1px}.md\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:1024px){.lg\:px-8{padding-left:2rem;padding-right:2rem}}@media (prefers-color-scheme:dark){.dark\:bg-gray-800{--bg-opacity:1;background-color:#2d3748;background-color:rgba(45,55,72,var(--bg-opacity))}.dark\:bg-gray-900{--bg-opacity:1;background-color:#1a202c;background-color:rgba(26,32,44,var(--bg-opacity))}.dark\:border-gray-700{--border-opacity:1;border-color:#4a5568;border-color:rgba(74,85,104,var(--border-opacity))}.dark\:text-white{--text-opacity:1;color:#fff;color:rgba(255,255,255,var(--text-opacity))}.dark\:text-gray-400{--text-opacity:1;color:#cbd5e0;color:rgba(203,213,224,var(--text-opacity))}}
    </style>

    <style>
        body {
            font-family: 'Nunito';
        }
        .logo {
            fill: #3b3b3b;
        }
        @media (prefers-color-scheme:dark) {
            .dark\:logo {
                fill: #fff;
            }
        }
    </style>
</head>
<body class="antialiased">
<div class="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
    <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div class="flex justify-center pt-8 sm:justify-start sm:pt-0">
            <svg class="h-16 w-auto text-gray-700 sm:h-20" viewBox="0 0 326 80" xmlns="http://www.w3.org/2000/svg">
                <g id="Logo SIM">
                    <path
                        id="Vector"
                        d="M70.8195 66.3772C70.2422 65.4583 69.4875 64.6636 68.5995 64.0397C67.7116 63.4158 66.7081 62.9752 65.6479 62.7435C61.5915 61.8001 58.0735 59.2894 55.8625 55.7601C53.6516 52.2307 52.9276 47.9697 53.8486 43.9082C54.2027 42.3384 54.0851 40.699 53.5105 39.1958C52.9359 37.6926 51.93 36.3927 50.6191 35.4594C49.3081 34.5261 47.7506 34.001 46.1421 33.9499C44.5337 33.8989 42.9461 34.3242 41.5786 35.1725C40.2111 36.0209 39.1248 37.2543 38.456 38.718C37.7873 40.1818 37.5659 41.8104 37.8198 43.3995C38.0736 44.9886 38.7914 46.4673 39.8829 47.6498C40.9743 48.8323 42.3909 49.666 43.9546 50.046C45.9776 50.5023 47.8906 51.3534 49.584 52.5505C51.2774 53.7475 52.7179 55.2671 53.8229 57.0219C54.9279 58.7768 55.6757 60.7325 56.0234 62.7769C56.3712 64.8213 56.312 66.9143 55.8493 68.9358C55.5753 70.239 55.6241 71.5894 55.9916 72.8693C56.3591 74.1492 57.0341 75.3198 57.9577 76.2792C58.8813 77.2385 60.0254 77.9574 61.2905 78.3732C62.5556 78.789 63.9031 78.889 65.2157 78.6647C66.5284 78.4404 67.7662 77.8984 68.8214 77.0861C69.8766 76.2737 70.717 75.2157 71.2696 74.0041C71.8221 72.7924 72.07 71.4641 71.9916 70.1348C71.9131 68.8054 71.5108 67.5154 70.8195 66.3772Z"
                        fill="#594D95"
                    />
                    <path
                        id="Vector_2"
                        d="M20.6144 57.3133C22.0429 58.0928 23.6716 58.4278 25.2917 58.2752C26.9119 58.1226 28.4494 57.4894 29.7072 56.4569C30.965 55.4243 31.8856 54.0395 32.3508 52.4802C32.8161 50.9208 32.8048 49.258 32.3184 47.7051C31.7019 45.7249 31.4823 43.6426 31.6722 41.5774C31.8621 39.5122 32.4576 37.5048 33.4249 35.6703C34.3921 33.8358 35.7119 32.2102 37.3086 30.8867C38.9053 29.5632 40.7475 28.568 42.7296 27.9579C44.2669 27.4764 45.6273 26.5509 46.6398 25.298C47.6523 24.0451 48.2716 22.5207 48.4197 20.9166C48.5679 19.3125 48.2383 17.7004 47.4724 16.2833C46.7065 14.8661 45.5385 13.7071 44.1155 12.9522C42.6924 12.1973 41.0779 11.8801 39.4751 12.0407C37.8722 12.2012 36.3526 12.8322 35.1075 13.8544C33.8624 14.8765 32.9475 16.2441 32.4778 17.785C32.0082 19.3259 32.0048 20.9713 32.4681 22.5141C33.6843 26.4971 33.273 30.7998 31.3244 34.4803C29.3757 38.1608 26.0484 40.9194 22.0706 42.1524C20.5003 42.6078 19.1028 43.524 18.0591 44.7826C17.0154 46.0412 16.3735 47.5841 16.2166 49.2115C16.0598 50.839 16.3951 52.4761 17.1792 53.9108C17.9633 55.3456 19.16 56.5119 20.6144 57.2588V57.3133Z"
                        fill="#594D95"
                    />
                    <path
                        id="Vector_3"
                        d="M41.6273 55.9794C40.5416 56.0175 39.4745 56.2719 38.4883 56.7276C37.5021 57.1833 36.6168 57.8311 35.8841 58.6333C33.0416 61.6736 29.1109 63.4648 24.9515 63.6153C20.792 63.7658 16.7421 62.2632 13.6873 59.4362C12.898 58.6956 11.9694 58.1193 10.9554 57.7408C9.94151 57.3623 8.86241 57.1892 7.78091 57.2315C6.44971 57.2943 5.15401 57.682 4.00711 58.3607C2.86011 59.0394 1.89681 59.9885 1.20111 61.1251C0.505306 62.2618 0.0984058 63.5515 0.0157058 64.8816C-0.0668942 66.2118 0.177206 67.5419 0.726906 68.756C1.27661 69.97 2.11501 71.0311 3.16911 71.8466C4.22321 72.6621 5.4608 73.2071 6.774 73.4342C8.0872 73.6613 9.43611 73.5636 10.7028 73.1495C11.9696 72.7354 13.1157 72.0176 14.0411 71.0586C15.4489 69.5344 17.1435 68.3029 19.0279 67.4347C20.9124 66.5665 22.9496 66.0785 25.0229 65.9989C27.0962 65.9193 29.1649 66.2494 31.1104 66.9705C33.0559 67.6917 34.84 68.7895 36.3605 70.2012C37.3504 71.0957 38.5444 71.7339 39.838 72.0601C41.1317 72.3864 42.4855 72.3907 43.7812 72.0727C45.0769 71.7547 46.2748 71.1241 47.2704 70.236C48.266 69.3479 49.0288 68.2293 49.4922 66.9782C49.9555 65.7271 50.1052 64.3816 49.9283 63.0592C49.7513 61.7369 49.253 60.4781 48.4769 59.3928C47.7009 58.3076 46.6709 57.4291 45.4768 56.834C44.2827 56.239 42.961 55.9455 41.6273 55.9794Z"
                        fill="#594D95"
                    />
                    <path
                        id="SISTEMA DE INFORMACION MISIONAL"
                        d="M85.2139 71.4365C85.2139 70.999 85.0589 70.6618 84.749 70.4248C84.4437 70.1878 83.89 69.9486 83.0879 69.707C82.2858 69.4655 81.6478 69.1966 81.1738 68.9004C80.2669 68.3307 79.8135 67.5879 79.8135 66.6719C79.8135 65.8698 80.1393 65.209 80.791 64.6895C81.4473 64.1699 82.2972 63.9102 83.3408 63.9102C84.0335 63.9102 84.651 64.0378 85.1934 64.293C85.7357 64.5482 86.1618 64.9128 86.4717 65.3867C86.7816 65.8561 86.9365 66.3779 86.9365 66.9521H85.2139C85.2139 66.4326 85.0498 66.027 84.7217 65.7354C84.3981 65.4391 83.9333 65.291 83.3271 65.291C82.762 65.291 82.3223 65.4118 82.0078 65.6533C81.6979 65.8949 81.543 66.2321 81.543 66.665C81.543 67.0296 81.7116 67.335 82.0488 67.5811C82.3861 67.8226 82.9421 68.0596 83.7168 68.292C84.4915 68.5199 85.1136 68.7819 85.583 69.0781C86.0524 69.3698 86.3965 69.707 86.6152 70.0898C86.834 70.4681 86.9434 70.9124 86.9434 71.4229C86.9434 72.2523 86.6243 72.9131 85.9863 73.4053C85.3529 73.8929 84.4915 74.1367 83.4023 74.1367C82.6823 74.1367 82.0192 74.0046 81.4131 73.7402C80.8115 73.4714 80.3421 73.1022 80.0049 72.6328C79.6722 72.1634 79.5059 71.6165 79.5059 70.9922H81.2354C81.2354 71.5573 81.4222 71.9948 81.7959 72.3047C82.1696 72.6146 82.7051 72.7695 83.4023 72.7695C84.0039 72.7695 84.4551 72.6488 84.7559 72.4072C85.0612 72.1611 85.2139 71.8376 85.2139 71.4365ZM90.3001 74H88.5775V64.0469H90.3001V74ZM97.6423 71.4365C97.6423 70.999 97.4873 70.6618 97.1774 70.4248C96.8721 70.1878 96.3184 69.9486 95.5163 69.707C94.7142 69.4655 94.0762 69.1966 93.6022 68.9004C92.6953 68.3307 92.2419 67.5879 92.2419 66.6719C92.2419 65.8698 92.5677 65.209 93.2194 64.6895C93.8757 64.1699 94.7256 63.9102 95.7692 63.9102C96.4619 63.9102 97.0794 64.0378 97.6217 64.293C98.1641 64.5482 98.5902 64.9128 98.9001 65.3867C99.21 65.8561 99.3649 66.3779 99.3649 66.9521H97.6423C97.6423 66.4326 97.4782 66.027 97.1501 65.7354C96.8265 65.4391 96.3617 65.291 95.7555 65.291C95.1904 65.291 94.7507 65.4118 94.4362 65.6533C94.1263 65.8949 93.9714 66.2321 93.9714 66.665C93.9714 67.0296 94.14 67.335 94.4772 67.5811C94.8145 67.8226 95.3704 68.0596 96.1452 68.292C96.9199 68.5199 97.542 68.7819 98.0114 69.0781C98.4808 69.3698 98.8249 69.707 99.0436 70.0898C99.2624 70.4681 99.3717 70.9124 99.3717 71.4229C99.3717 72.2523 99.0527 72.9131 98.4147 73.4053C97.7813 73.8929 96.9199 74.1367 95.8307 74.1367C95.1107 74.1367 94.4476 74.0046 93.8415 73.7402C93.2399 73.4714 92.7705 73.1022 92.4333 72.6328C92.1006 72.1634 91.9342 71.6165 91.9342 70.9922H93.6637C93.6637 71.5573 93.8506 71.9948 94.2243 72.3047C94.598 72.6146 95.1335 72.7695 95.8307 72.7695C96.4323 72.7695 96.8835 72.6488 97.1842 72.4072C97.4896 72.1611 97.6423 71.8376 97.6423 71.4365ZM108.095 65.4414H104.991V74H103.275V65.4414H100.199V64.0469H108.095V65.4414ZM115.239 69.5566H111.151V72.6191H115.929V74H109.421V64.0469H115.881V65.4414H111.151V68.1895H115.239V69.5566ZM119.593 64.0469L122.465 71.6758L125.329 64.0469H127.564V74H125.841V70.7188L126.012 66.3301L123.073 74H121.836L118.903 66.3369L119.074 70.7188V74H117.351V64.0469H119.593ZM135.323 71.6826H131.468L130.661 74H128.863L132.623 64.0469H134.175L137.941 74H136.137L135.323 71.6826ZM131.953 70.2881H134.838L133.396 66.1592L131.953 70.2881ZM142.591 74V64.0469H145.53C146.41 64.0469 147.189 64.2428 147.868 64.6348C148.551 65.0267 149.08 65.5827 149.454 66.3027C149.827 67.0228 150.014 67.8477 150.014 68.7773V69.2764C150.014 70.2197 149.825 71.0492 149.447 71.7646C149.073 72.4801 148.538 73.0316 147.841 73.4189C147.148 73.8063 146.353 74 145.455 74H142.591ZM144.32 65.4414V72.6191H145.448C146.355 72.6191 147.05 72.3366 147.533 71.7715C148.021 71.2018 148.269 70.3861 148.278 69.3242V68.7705C148.278 67.6904 148.043 66.8656 147.574 66.2959C147.105 65.7262 146.423 65.4414 145.53 65.4414H144.32ZM157.568 69.5566H153.48V72.6191H158.259V74H151.751V64.0469H158.211V65.4414H153.48V68.1895H157.568V69.5566ZM165.007 74H163.284V64.0469H165.007V74ZM175.042 74H173.313L168.876 66.9385V74H167.147V64.0469H168.876L173.326 71.1357V64.0469H175.042V74ZM182.835 69.7822H178.829V74H177.1V64.0469H183.423V65.4414H178.829V68.4014H182.835V69.7822ZM192.755 69.2832C192.755 70.2585 192.586 71.1152 192.249 71.8535C191.911 72.5872 191.428 73.1523 190.8 73.5488C190.175 73.9408 189.455 74.1367 188.639 74.1367C187.833 74.1367 187.113 73.9408 186.479 73.5488C185.85 73.1523 185.363 72.5895 185.016 71.8604C184.675 71.1312 184.501 70.2904 184.497 69.3379V68.7773C184.497 67.8066 184.668 66.9499 185.009 66.207C185.356 65.4642 185.841 64.8968 186.466 64.5049C187.094 64.1084 187.814 63.9102 188.626 63.9102C189.437 63.9102 190.155 64.1061 190.779 64.498C191.408 64.8854 191.893 65.446 192.235 66.1797C192.577 66.9089 192.75 67.7588 192.755 68.7295V69.2832ZM191.025 68.7637C191.025 67.6608 190.815 66.8154 190.396 66.2275C189.981 65.6396 189.391 65.3457 188.626 65.3457C187.878 65.3457 187.293 65.6396 186.869 66.2275C186.45 66.8109 186.235 67.638 186.226 68.709V69.2832C186.226 70.377 186.438 71.2223 186.862 71.8193C187.29 72.4163 187.883 72.7148 188.639 72.7148C189.405 72.7148 189.993 72.4232 190.403 71.8398C190.818 71.2565 191.025 70.4043 191.025 69.2832V68.7637ZM198.148 70.165H196.221V74H194.491V64.0469H197.991C199.14 64.0469 200.026 64.3044 200.65 64.8193C201.275 65.3343 201.587 66.0794 201.587 67.0547C201.587 67.7201 201.425 68.2783 201.102 68.7295C200.783 69.1761 200.336 69.5202 199.762 69.7617L201.997 73.9111V74H200.145L198.148 70.165ZM196.221 68.7773H197.998C198.581 68.7773 199.037 68.6315 199.365 68.3398C199.693 68.0436 199.857 67.6403 199.857 67.1299C199.857 66.5967 199.705 66.1842 199.399 65.8926C199.099 65.6009 198.647 65.4505 198.046 65.4414H196.221V68.7773ZM205.484 64.0469L208.355 71.6758L211.219 64.0469H213.454V74H211.732V70.7188L211.903 66.3301L208.963 74H207.726L204.793 66.3369L204.964 70.7188V74H203.242V64.0469H205.484ZM221.214 71.6826H217.358L216.551 74H214.754L218.513 64.0469H220.065L223.832 74H222.027L221.214 71.6826ZM217.843 70.2881H220.728L219.286 66.1592L217.843 70.2881ZM232.425 70.7598C232.325 71.8216 231.933 72.651 231.249 73.248C230.565 73.8405 229.656 74.1367 228.522 74.1367C227.729 74.1367 227.029 73.9499 226.423 73.5762C225.821 73.1979 225.356 72.6624 225.028 71.9697C224.7 71.277 224.529 70.4727 224.516 69.5566V68.627C224.516 67.6882 224.682 66.861 225.015 66.1455C225.347 65.43 225.824 64.8786 226.443 64.4912C227.068 64.1038 227.788 63.9102 228.604 63.9102C229.702 63.9102 230.586 64.2087 231.256 64.8057C231.926 65.4027 232.315 66.2458 232.425 67.335H230.702C230.62 66.6195 230.411 66.1045 230.073 65.79C229.741 65.471 229.251 65.3115 228.604 65.3115C227.852 65.3115 227.273 65.5872 226.867 66.1387C226.466 66.6855 226.261 67.4899 226.252 68.5518V69.4336C226.252 70.5091 226.443 71.3294 226.826 71.8945C227.214 72.4596 227.779 72.7422 228.522 72.7422C229.201 72.7422 229.711 72.5895 230.053 72.2842C230.395 71.9788 230.611 71.4707 230.702 70.7598H232.425ZM235.816 74H234.093V64.0469H235.816V74ZM245.899 69.2832C245.899 70.2585 245.731 71.1152 245.393 71.8535C245.056 72.5872 244.573 73.1523 243.944 73.5488C243.32 73.9408 242.6 74.1367 241.784 74.1367C240.977 74.1367 240.257 73.9408 239.624 73.5488C238.995 73.1523 238.507 72.5895 238.161 71.8604C237.819 71.1312 237.646 70.2904 237.641 69.3379V68.7773C237.641 67.8066 237.812 66.9499 238.154 66.207C238.5 65.4642 238.986 64.8968 239.61 64.5049C240.239 64.1084 240.959 63.9102 241.77 63.9102C242.581 63.9102 243.299 64.1061 243.924 64.498C244.552 64.8854 245.038 65.446 245.38 66.1797C245.721 66.9089 245.895 67.7588 245.899 68.7295V69.2832ZM244.17 68.7637C244.17 67.6608 243.96 66.8154 243.541 66.2275C243.126 65.6396 242.536 65.3457 241.77 65.3457C241.023 65.3457 240.437 65.6396 240.013 66.2275C239.594 66.8109 239.38 67.638 239.371 68.709V69.2832C239.371 70.377 239.583 71.2223 240.007 71.8193C240.435 72.4163 241.027 72.7148 241.784 72.7148C242.55 72.7148 243.137 72.4232 243.548 71.8398C243.962 71.2565 244.17 70.4043 244.17 69.2832V68.7637ZM242.276 61.3809H244.17L242.276 63.4521H240.943L242.276 61.3809ZM255.531 74H253.802L249.365 66.9385V74H247.636V64.0469H249.365L253.815 71.1357V64.0469H255.531V74ZM263.332 64.0469L266.203 71.6758L269.067 64.0469H271.302V74H269.58V70.7188L269.751 66.3301L266.811 74H265.574L262.641 66.3369L262.812 70.7188V74H261.09V64.0469H263.332ZM275.192 74H273.47V64.0469H275.192V74ZM282.535 71.4365C282.535 70.999 282.38 70.6618 282.07 70.4248C281.764 70.1878 281.211 69.9486 280.409 69.707C279.607 69.4655 278.968 69.1966 278.495 68.9004C277.588 68.3307 277.134 67.5879 277.134 66.6719C277.134 65.8698 277.46 65.209 278.112 64.6895C278.768 64.1699 279.618 63.9102 280.662 63.9102C281.354 63.9102 281.972 64.0378 282.514 64.293C283.056 64.5482 283.482 64.9128 283.792 65.3867C284.102 65.8561 284.257 66.3779 284.257 66.9521H282.535C282.535 66.4326 282.371 66.027 282.042 65.7354C281.719 65.4391 281.254 65.291 280.648 65.291C280.083 65.291 279.643 65.4118 279.329 65.6533C279.019 65.8949 278.864 66.2321 278.864 66.665C278.864 67.0296 279.032 67.335 279.37 67.5811C279.707 67.8226 280.263 68.0596 281.038 68.292C281.812 68.5199 282.434 68.7819 282.904 69.0781C283.373 69.3698 283.717 69.707 283.936 70.0898C284.155 70.4681 284.264 70.9124 284.264 71.4229C284.264 72.2523 283.945 72.9131 283.307 73.4053C282.674 73.8929 281.812 74.1367 280.723 74.1367C280.003 74.1367 279.34 74.0046 278.734 73.7402C278.132 73.4714 277.663 73.1022 277.326 72.6328C276.993 72.1634 276.827 71.6165 276.827 70.9922H278.556C278.556 71.5573 278.743 71.9948 279.117 72.3047C279.49 72.6146 280.026 72.7695 280.723 72.7695C281.325 72.7695 281.776 72.6488 282.077 72.4072C282.382 72.1611 282.535 71.8376 282.535 71.4365ZM287.621 74H285.898V64.0469H287.621V74ZM297.704 69.2832C297.704 70.2585 297.536 71.1152 297.198 71.8535C296.861 72.5872 296.378 73.1523 295.749 73.5488C295.125 73.9408 294.405 74.1367 293.589 74.1367C292.782 74.1367 292.062 73.9408 291.429 73.5488C290.8 73.1523 290.312 72.5895 289.966 71.8604C289.624 71.1312 289.451 70.2904 289.446 69.3379V68.7773C289.446 67.8066 289.617 66.9499 289.959 66.207C290.305 65.4642 290.791 64.8968 291.415 64.5049C292.044 64.1084 292.764 63.9102 293.575 63.9102C294.386 63.9102 295.104 64.1061 295.729 64.498C296.357 64.8854 296.843 65.446 297.185 66.1797C297.526 66.9089 297.7 67.7588 297.704 68.7295V69.2832ZM295.975 68.7637C295.975 67.6608 295.765 66.8154 295.346 66.2275C294.931 65.6396 294.341 65.3457 293.575 65.3457C292.828 65.3457 292.242 65.6396 291.818 66.2275C291.399 66.8109 291.185 67.638 291.176 68.709V69.2832C291.176 70.377 291.388 71.2223 291.812 71.8193C292.24 72.4163 292.832 72.7148 293.589 72.7148C294.355 72.7148 294.942 72.4232 295.353 71.8398C295.767 71.2565 295.975 70.4043 295.975 69.2832V68.7637ZM307.336 74H305.607L301.17 66.9385V74H299.441V64.0469H301.17L305.621 71.1357V64.0469H307.336V74ZM315.089 71.6826H311.233L310.427 74H308.629L312.388 64.0469H313.94L317.707 74H315.902L315.089 71.6826ZM311.719 70.2881H314.603L313.161 66.1592L311.719 70.2881ZM320.585 72.6191H325.104V74H318.856V64.0469H320.585V72.6191Z"
                        class="logo dark:logo"
                    />
                    <path
                        id="SIM"
                        d="M96.1577 56.5435C93.242 56.5435 90.6196 56.2415 88.2905 55.6377C85.9614 55.0339 83.6582 53.9469 81.3809 52.377V42.9053H87.7988L88.6011 48.1069C89.2567 48.7453 90.2746 49.2715 91.6548 49.6855C93.035 50.0996 94.536 50.3066 96.1577 50.3066C97.4344 50.3066 98.4954 50.1427 99.3408 49.8149C100.203 49.4871 100.85 49.0127 101.282 48.3916C101.73 47.7533 101.955 47.0028 101.955 46.1401C101.955 45.312 101.748 44.5788 101.333 43.9404C100.937 43.3021 100.272 42.7069 99.3408 42.1548C98.4264 41.6027 97.1842 41.0506 95.6143 40.4985C92.5088 39.5496 89.9468 38.549 87.9282 37.4966C85.9097 36.4269 84.4001 35.1675 83.3994 33.7183C82.416 32.2518 81.9243 30.4661 81.9243 28.3613C81.9243 26.291 82.5023 24.4795 83.6582 22.9268C84.8314 21.3568 86.4359 20.1232 88.4717 19.2261C90.5247 18.3289 92.8711 17.8631 95.5107 17.8286C98.5127 17.7596 101.161 18.0788 103.456 18.7861C105.75 19.4935 107.76 20.5114 109.485 21.8398V30.6387H103.274L102.265 25.5146C101.644 25.1696 100.781 24.859 99.6772 24.583C98.5731 24.307 97.3654 24.1689 96.0542 24.1689C94.9155 24.1689 93.9062 24.3328 93.0264 24.6606C92.1637 24.9712 91.4823 25.437 90.9819 26.0581C90.4816 26.6792 90.2314 27.4469 90.2314 28.3613C90.2314 29.1032 90.4385 29.7674 90.8525 30.354C91.2839 30.9406 92.0257 31.5099 93.0781 32.062C94.1305 32.5968 95.5884 33.1921 97.4517 33.8477C101.661 35.0553 104.862 36.6081 107.053 38.5059C109.244 40.4036 110.339 42.9312 110.339 46.0884C110.339 48.2795 109.744 50.16 108.554 51.73C107.363 53.2827 105.707 54.4731 103.585 55.3013C101.463 56.1294 98.9871 56.5435 96.1577 56.5435ZM116.121 56V51.083L120.08 50.2808V24.0654L116.121 23.2632V18.3203H132.347V23.2632L128.387 24.0654V50.2808L132.347 51.083V56H116.121ZM138.025 56V51.083L141.958 50.2808V24.0654L138.025 23.2632V18.3203H141.958H154.509L164.188 43.8628H164.343L173.763 18.3203H190.145V23.2632L186.159 24.0654V50.2808L190.145 51.083V56H173.893V51.083L178.033 50.2808V44.1992L178.215 26.8604L178.059 26.8345L167.087 55.7412H160.669L149.515 27.1191L149.334 27.145L149.877 43.2158V50.2808L154.277 51.083V56H138.025Z"
                        class="logo dark:logo"
                    />
                </g>
            </svg>
        </div>

        <div class="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-4">
                <div class="p-6">
                    <div class="flex items-center">
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-8 h-8 text-gray-500"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        <div class="ml-4 text-lg leading-7 font-semibold"><a href="https://sim.idrd.gov.co" class="underline text-gray-900 dark:text-white">S.I.M.</a></div>
                    </div>

                    <div class="ml-12">
                        <div class="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                            Sistema de Información Misional del Instituto Distrital de Recreación y Deporte
                            <div class="text-lg leading-7 font-semibold">
                                <a href="https://sim.idrd.gov.co" class="underline text-gray-900 dark:text-white">Ir al S.I.M.</a>
                            </div>
                            <div class="text-lg leading-7 font-semibold">
                                <a href="{{ asset('/docs/index.html')  }}" class="underline text-gray-900 dark:text-white">Ver la documentación de la API</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center mt-4 sm:items-center sm:justify-between">
            <div class="ml-4 text-center text-sm text-gray-500 sm:text-right sm:ml-0">
                {{ config('app.name') }} v{{ Illuminate\Foundation\Application::VERSION }} (IDRD)
            </div>
        </div>
    </div>
</div>
</body>
</html>