// ==UserScript==
// @name         zaki's shitty mass collection downloader
// @namespace    https://neozaki.tech/
// @version      0.2
// @description  mass downloads torrents from a collection
// @author       zaki
// @match        https://oppaiti.me/collages.php?id=*
// @grant        GM_download
// @grant        GM_info
// ==/UserScript==


//ahem FUCK JS thank you
document.querySelector(".sidebar").innerHTML += '<div class="box"><div class="head"><strong>Auto Snatch</strong></div><div class="pad"><div class="submit_div">\
<div class="option_group"><input type="checkbox" name="mostsnatch" id="mostsnatch" checked="checked"><label for="mostsnatch"> download most snatched only</label>\
<div class="option_group"><input type="checkbox" name="prefuncensored" id="prefuncensored"><label for="prefuncensored"> prefer uncensored</label>\
<div class="option_group"><input type="checkbox" name="prefcbz" id="prefcbz"><label for="prefcbz"> prefer things from group (*/*/*)</label>\
<div class="field_div"><input type="text" size="10" name="format" id="prefformat"></div>\
<div class="option_group"><input type="checkbox" name="excludeshit" id="excludeshit"><label for="excludeshit"> exclude tags</label>\
<div class="field_div"><input type="text" size="10" name="format" id="excat"></div>\
<div class="option_group"><input type="number" name="timedelay" id="timedelay" min="100" max="9999" value="500"><label for="timedelay"> delay between downloads</label>\
</div><input type="submit" id="snatch" value="Snatch!"></div>\
<style>input[type=number] {-moz-appearance: textfield;width:30px;}\
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {-webkit-appearance: none;margin: 0;}</style>\
</div></div>'

document.getElementById("snatch").addEventListener("click", n => {
    var collage = document.querySelector("h2").innerText + "/";
    var timedelay = document.querySelector("#timedelay").value;
    var maxfromgroup = [];
    //exclude scat and gayshit code
    var alltor = document.querySelectorAll(".torrent");
    var allgroup = document.querySelectorAll(".group");
    if (document.querySelector("#excludeshit").checked) {
        var extaglist = document.querySelector("#excat").value.toLowerCase().split(",").map(s => s.trim());
        var includedtor = [];
        alltor.forEach(e => {
            var taglist = e.querySelector(".tags").innerText.toLowerCase().split(", ");
            if (!extaglist.some(c => taglist.indexOf(c) >= 0)) {
                includedtor.push(e);
            }
        });
        alltor = [...includedtor];
        var includedgroup = [];
        allgroup.forEach(e => {
            var taglist = e.querySelector(".tags").innerText.toLowerCase().split(", ");
            if (!extaglist.some(c => taglist.indexOf(c) >= 0)) {
                includedgroup.push(e);
            }
        });
        allgroup = [...includedgroup];
    }
    alltor.forEach(e => {maxfromgroup.push(e.querySelector("a").href);});
    if (document.querySelector("#mostsnatch").checked) {
        allgroup.forEach(e => {
            var groupidclass = [...document.getElementsByClassName(e.id.slice(0,5) + "id" + e.id.slice(5))];
            var snatchedlist = [];
            //clean this shit -- no
            //prefer cbz code
            if (document.querySelector("#prefcbz").checked) {
                var format = document.querySelector("#prefformat").value.toLowerCase().split(",").map(s => s.trim());
                var filteredlist = groupidclass.filter(e => format.some(c => e.querySelectorAll("a")[2].firstChild.textContent.toLowerCase().indexOf(c) >= 0));
                if (filteredlist.length > 0) {
                    groupidclass = [...filteredlist];
                }
            }
            //prefer uncensored code
            if (document.querySelector("#prefuncensored").checked) {
                var ifuncen = false;
                groupidclass.forEach(e => {
                    if (e.querySelectorAll("a")[2].children[0].textContent == "Uncensored") {
                        snatchedlist.push(e.getElementsByClassName("number_column")[1].innerText);
                        ifuncen = true;
                    }
                });
                if (!ifuncen) {
                    groupidclass.forEach(e => {
                        snatchedlist.push(e.getElementsByClassName("number_column")[1].innerText);
                    });
                }
            } else {
                groupidclass.forEach(e => {
                    snatchedlist.push(e.getElementsByClassName("number_column")[1].innerText);
                }); 
            }
            maxfromgroup.push(groupidclass.find(e => e.getElementsByClassName("number_column")[1].innerText == Math.max.apply(Math, snatchedlist)).querySelector("a").href);
        });
    } else {
        document.querySelectorAll(".group_torrent").forEach(e => {maxfromgroup.push(e.querySelector("a").href);});
    }
    maxfromgroup.forEach((e, i) => {
        setTimeout(function() {
            GM_download(e, collage + i + ".torrent");
        }, i * timedelay);
    });
} , false);
