Truyencv Crawler
=============

Script to download chapters of a specific book from truyencv.com as text files (maybe in the future we will have pdf as well)

Getting started
=============
First, install [Node.js](https://nodejs.org) `6.x.x` or higher. Then open your terminal and `cd` to project path.

#### You'll need to install the dependencies
```
npm install
```
#### Now to download the chapters, use the following command
```
npm start ten-truyen-khong-dau-voi-gach-ngang-giua-cac-tu [from-chapter] [to-chapter]
```
For example:
```
npm start cuc-pham-khoac-lac-he-thong 30 60
```

Will get 30th - 60th chapter of [Cực phẩm khoác lác hệ thống](http://truyencv.com/cuc-pham-khoac-lac-he-thong/).

#### You can also get a single chapter
```
npm start cuc-pham-khoac-lac-he-thong 19
```
That will get the 19th chapter

#### Or simply get everything
```
npm start cuc-pham-khoac-lac-he-thong
```
That will get all available chapters

Configuration
=============
In the file `.env-var` there are some configs that you can change
```
# Debug mode, 1 = On, default is 0
export debug=1 
# Send 1 request to truyencv every 600ms, default is 1000
export interval=600 
# Path to save the chapters, default is './truyen'
export saveFolder=
```
After changing the config file, simply `source .env-var` and the script will use the new value.

