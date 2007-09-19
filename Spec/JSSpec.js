/**
 * JSSpec
 *
 * Copyright 2007 Alan Kang
 *  - mailto:jania902@gmail.com
 *  - http://jania.pe.kr
 *
 * http://jania.pe.kr/aw/moin.cgi/JSSpec
 *
 * Dependencies:
 *  - diff_match_patch.js ( http://code.google.com/p/diff_match_patch )
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc, 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA
 */

/**
 * Namespace
 */

function diff_match_patch(){this.Diff_Timeout=1.0;this.Diff_EditCost=4;this.Diff_DualThreshold=32;this.Match_Balance=0.5;this.Match_Threshold=0.5;this.Match_MinLength=100;this.Match_MaxLength=1000;this.Patch_Margin=4;function getMaxBits(){var maxbits=0;var oldi=1;var newi=2;while(oldi!=newi){maxbits++;oldi=newi;newi=newi<<1}return maxbits}this.Match_MaxBits=getMaxBits()}var DIFF_DELETE=-1;var DIFF_INSERT=1;var DIFF_EQUAL=0;diff_match_patch.prototype.diff_main=function(text1,text2,opt_checklines){if(text1==text2){return[[DIFF_EQUAL,text1]]}if(typeof opt_checklines=='undefined'){opt_checklines=true}var checklines=opt_checklines;var commonlength=this.diff_commonPrefix(text1,text2);var commonprefix=text1.substring(0,commonlength);text1=text1.substring(commonlength);text2=text2.substring(commonlength);commonlength=this.diff_commonSuffix(text1,text2);var commonsuffix=text1.substring(text1.length-commonlength);text1=text1.substring(0,text1.length-commonlength);text2=text2.substring(0,text2.length-commonlength);var diffs=this.diff_compute(text1,text2,checklines);if(commonprefix){diffs.unshift([DIFF_EQUAL,commonprefix])}if(commonsuffix){diffs.push([DIFF_EQUAL,commonsuffix])}this.diff_cleanupMerge(diffs);return diffs};diff_match_patch.prototype.diff_compute=function(text1,text2,checklines){var diffs;if(!text1){return[[DIFF_INSERT,text2]]}if(!text2){return[[DIFF_DELETE,text1]]}var longtext=text1.length>text2.length?text1:text2;var shorttext=text1.length>text2.length?text2:text1;var i=longtext.indexOf(shorttext);if(i!=-1){diffs=[[DIFF_INSERT,longtext.substring(0,i)],[DIFF_EQUAL,shorttext],[DIFF_INSERT,longtext.substring(i+shorttext.length)]];if(text1.length>text2.length){diffs[0][0]=diffs[2][0]=DIFF_DELETE}return diffs}longtext=shorttext=null;var hm=this.diff_halfMatch(text1,text2);if(hm){var text1_a=hm[0];var text1_b=hm[1];var text2_a=hm[2];var text2_b=hm[3];var mid_common=hm[4];var diffs_a=this.diff_main(text1_a,text2_a,checklines);var diffs_b=this.diff_main(text1_b,text2_b,checklines);return diffs_a.concat([[DIFF_EQUAL,mid_common]],diffs_b)}if(checklines&&text1.length+text2.length<250){checklines=false}var linearray;if(checklines){var a=this.diff_linesToChars(text1,text2);text1=a[0];text2=a[1];linearray=a[2]}diffs=this.diff_map(text1,text2);if(!diffs){diffs=[[DIFF_DELETE,text1],[DIFF_INSERT,text2]]}if(checklines){this.diff_charsToLines(diffs,linearray);this.diff_cleanupSemantic(diffs);diffs.push([DIFF_EQUAL,'']);var pointer=0;var count_delete=0;var count_insert=0;var text_delete='';var text_insert='';while(pointer<diffs.length){if(diffs[pointer][0]==DIFF_INSERT){count_insert++;text_insert+=diffs[pointer][1]}else if(diffs[pointer][0]==DIFF_DELETE){count_delete++;text_delete+=diffs[pointer][1]}else{if(count_delete>=1&&count_insert>=1){var a=this.diff_main(text_delete,text_insert,false);diffs.splice(pointer-count_delete-count_insert,count_delete+count_insert);pointer=pointer-count_delete-count_insert;for(var j=a.length-1;j>=0;j--){diffs.splice(pointer,0,a[j])}pointer=pointer+a.length}count_insert=0;count_delete=0;text_delete='';text_insert=''}pointer++}diffs.pop()}return diffs};diff_match_patch.prototype.diff_linesToChars=function(text1,text2){var linearray=[];var linehash={};linearray.push('');function diff_linesToCharsMunge(text){var chars='';while(text){var i=text.indexOf('\n');if(i==-1){i=text.length}var line=text.substring(0,i+1);text=text.substring(i+1);if(linehash.hasOwnProperty?linehash.hasOwnProperty(line):(linehash[line]!==undefined)){chars+=String.fromCharCode(linehash[line])}else{linearray.push(line);linehash[line]=linearray.length-1;chars+=String.fromCharCode(linearray.length-1)}}return chars}var chars1=diff_linesToCharsMunge(text1);var chars2=diff_linesToCharsMunge(text2);return[chars1,chars2,linearray]};diff_match_patch.prototype.diff_charsToLines=function(diffs,linearray){for(var x=0;x<diffs.length;x++){var chars=diffs[x][1];var text='';for(var y=0;y<chars.length;y++){text+=linearray[chars.charCodeAt(y)]}diffs[x][1]=text}};diff_match_patch.prototype.diff_map=function(text1,text2){var ms_end=(new Date()).getTime()+this.Diff_Timeout*1000;var max_d=text1.length+text2.length-1;var doubleEnd=this.Diff_DualThreshold*2<max_d;var v_map1=[];var v_map2=[];var v1={};var v2={};v1[1]=0;v2[1]=0;var x,y;var footstep;var footsteps={};var done=false;var hasOwnProperty=!!(footsteps.hasOwnProperty);var front=(text1.length+text2.length)%2;for(var d=0;d<max_d;d++){if(this.Diff_Timeout>0&&(new Date()).getTime()>ms_end){return null}v_map1[d]={};for(var k=-d;k<=d;k+=2){if(k==-d||k!=d&&v1[k-1]<v1[k+1]){x=v1[k+1]}else{x=v1[k-1]+1}y=x-k;if(doubleEnd){footstep=x+','+y;if(front&&(hasOwnProperty?footsteps.hasOwnProperty(footstep):(footsteps[footstep]!==undefined))){done=true}if(!front){footsteps[footstep]=d}}while(!done&&x<text1.length&&y<text2.length&&text1.charAt(x)==text2.charAt(y)){x++;y++;if(doubleEnd){footstep=x+','+y;if(front&&(hasOwnProperty?footsteps.hasOwnProperty(footstep):(footsteps[footstep]!==undefined))){done=true}if(!front){footsteps[footstep]=d}}}v1[k]=x;v_map1[d][x+','+y]=true;if(x==text1.length&&y==text2.length){return this.diff_path1(v_map1,text1,text2)}else if(done){v_map2=v_map2.slice(0,footsteps[footstep]+1);var a=this.diff_path1(v_map1,text1.substring(0,x),text2.substring(0,y));return a.concat(this.diff_path2(v_map2,text1.substring(x),text2.substring(y)))}}if(doubleEnd){v_map2[d]={};for(var k=-d;k<=d;k+=2){if(k==-d||k!=d&&v2[k-1]<v2[k+1]){x=v2[k+1]}else{x=v2[k-1]+1}y=x-k;footstep=(text1.length-x)+','+(text2.length-y);if(!front&&(hasOwnProperty?footsteps.hasOwnProperty(footstep):(footsteps[footstep]!==undefined))){done=true}if(front){footsteps[footstep]=d}while(!done&&x<text1.length&&y<text2.length&&text1.charAt(text1.length-x-1)==text2.charAt(text2.length-y-1)){x++;y++;footstep=(text1.length-x)+','+(text2.length-y);if(!front&&(hasOwnProperty?footsteps.hasOwnProperty(footstep):(footsteps[footstep]!==undefined))){done=true}if(front){footsteps[footstep]=d}}v2[k]=x;v_map2[d][x+','+y]=true;if(done){v_map1=v_map1.slice(0,footsteps[footstep]+1);var a=this.diff_path1(v_map1,text1.substring(0,text1.length-x),text2.substring(0,text2.length-y));return a.concat(this.diff_path2(v_map2,text1.substring(text1.length-x),text2.substring(text2.length-y)))}}}}return null};diff_match_patch.prototype.diff_path1=function(v_map,text1,text2){var path=[];var x=text1.length;var y=text2.length;var last_op=null;for(var d=v_map.length-2;d>=0;d--){while(1){if(v_map[d].hasOwnProperty?v_map[d].hasOwnProperty((x-1)+','+y):(v_map[d][(x-1)+','+y]!==undefined)){x--;if(last_op===DIFF_DELETE){path[0][1]=text1.charAt(x)+path[0][1]}else{path.unshift([DIFF_DELETE,text1.charAt(x)])}last_op=DIFF_DELETE;break}else if(v_map[d].hasOwnProperty?v_map[d].hasOwnProperty(x+','+(y-1)):(v_map[d][x+','+(y-1)]!==undefined)){y--;if(last_op===DIFF_INSERT){path[0][1]=text2.charAt(y)+path[0][1]}else{path.unshift([DIFF_INSERT,text2.charAt(y)])}last_op=DIFF_INSERT;break}else{x--;y--;if(last_op===DIFF_EQUAL){path[0][1]=text1.charAt(x)+path[0][1]}else{path.unshift([DIFF_EQUAL,text1.charAt(x)])}last_op=DIFF_EQUAL}}}return path};diff_match_patch.prototype.diff_path2=function(v_map,text1,text2){var path=[];var x=text1.length;var y=text2.length;var last_op=null;for(var d=v_map.length-2;d>=0;d--){while(1){if(v_map[d].hasOwnProperty?v_map[d].hasOwnProperty((x-1)+','+y):(v_map[d][(x-1)+','+y]!==undefined)){x--;if(last_op===DIFF_DELETE){path[path.length-1][1]+=text1.charAt(text1.length-x-1)}else{path.push([DIFF_DELETE,text1.charAt(text1.length-x-1)])}last_op=DIFF_DELETE;break}else if(v_map[d].hasOwnProperty?v_map[d].hasOwnProperty(x+','+(y-1)):(v_map[d][x+','+(y-1)]!==undefined)){y--;if(last_op===DIFF_INSERT){path[path.length-1][1]+=text2.charAt(text2.length-y-1)}else{path.push([DIFF_INSERT,text2.charAt(text2.length-y-1)])}last_op=DIFF_INSERT;break}else{x--;y--;if(last_op===DIFF_EQUAL){path[path.length-1][1]+=text1.charAt(text1.length-x-1)}else{path.push([DIFF_EQUAL,text1.charAt(text1.length-x-1)])}last_op=DIFF_EQUAL}}}return path};diff_match_patch.prototype.diff_commonPrefix=function(text1,text2){if(!text1||!text2||text1.charCodeAt(0)!==text2.charCodeAt(0)){return 0}var pointermin=0;var pointermax=Math.min(text1.length,text2.length);var pointermid=pointermax;var pointerstart=0;while(pointermin<pointermid){if(text1.substring(pointerstart,pointermid)==text2.substring(pointerstart,pointermid)){pointermin=pointermid;pointerstart=pointermin}else{pointermax=pointermid}pointermid=Math.floor((pointermax-pointermin)/2+pointermin)}return pointermid};diff_match_patch.prototype.diff_commonSuffix=function(text1,text2){if(!text1||!text2||text1.charCodeAt(text1.length-1)!==text2.charCodeAt(text2.length-1)){return 0}var pointermin=0;var pointermax=Math.min(text1.length,text2.length);var pointermid=pointermax;var pointerend=0;while(pointermin<pointermid){if(text1.substring(text1.length-pointermid,text1.length-pointerend)==text2.substring(text2.length-pointermid,text2.length-pointerend)){pointermin=pointermid;pointerend=pointermin}else{pointermax=pointermid}pointermid=Math.floor((pointermax-pointermin)/2+pointermin)}return pointermid};diff_match_patch.prototype.diff_halfMatch=function(text1,text2){var longtext=text1.length>text2.length?text1:text2;var shorttext=text1.length>text2.length?text2:text1;if(longtext.length<10||shorttext.length<1){return null}var dmp=this;function diff_halfMatchI(longtext,shorttext,i){var seed=longtext.substring(i,i+Math.floor(longtext.length/4));var j=-1;var best_common='';var best_longtext_a,best_longtext_b,best_shorttext_a,best_shorttext_b;while((j=shorttext.indexOf(seed,j+1))!=-1){var prefixLength=dmp.diff_commonPrefix(longtext.substring(i),shorttext.substring(j));var suffixLength=dmp.diff_commonSuffix(longtext.substring(0,i),shorttext.substring(0,j));if(best_common.length<suffixLength+prefixLength){best_common=shorttext.substring(j-suffixLength,j)+shorttext.substring(j,j+prefixLength);best_longtext_a=longtext.substring(0,i-suffixLength);best_longtext_b=longtext.substring(i+prefixLength);best_shorttext_a=shorttext.substring(0,j-suffixLength);best_shorttext_b=shorttext.substring(j+prefixLength)}}if(best_common.length>=longtext.length/2){return[best_longtext_a,best_longtext_b,best_shorttext_a,best_shorttext_b,best_common]}else{return null}}var hm1=diff_halfMatchI(longtext,shorttext,Math.ceil(longtext.length/4));var hm2=diff_halfMatchI(longtext,shorttext,Math.ceil(longtext.length/2));var hm;if(!hm1&&!hm2){return null}else if(!hm2){hm=hm1}else if(!hm1){hm=hm2}else{hm=hm1[4].length>hm2[4].length?hm1:hm2}var text1_a,text1_b,text2_a,text2_b;if(text1.length>text2.length){text1_a=hm[0];text1_b=hm[1];text2_a=hm[2];text2_b=hm[3]}else{text2_a=hm[0];text2_b=hm[1];text1_a=hm[2];text1_b=hm[3]}var mid_common=hm[4];return[text1_a,text1_b,text2_a,text2_b,mid_common]};diff_match_patch.prototype.diff_cleanupSemantic=function(diffs){var changes=false;var equalities=[];var lastequality=null;var pointer=0;var length_changes1=0;var length_changes2=0;while(pointer<diffs.length){if(diffs[pointer][0]==DIFF_EQUAL){equalities.push(pointer);length_changes1=length_changes2;length_changes2=0;lastequality=diffs[pointer][1]}else{length_changes2+=diffs[pointer][1].length;if(lastequality!==null&&(lastequality.length<=length_changes1)&&(lastequality.length<=length_changes2)){diffs.splice(equalities[equalities.length-1],0,[DIFF_DELETE,lastequality]);diffs[equalities[equalities.length-1]+1][0]=DIFF_INSERT;equalities.pop();equalities.pop();pointer=equalities.length?equalities[equalities.length-1]:-1;length_changes1=0;length_changes2=0;lastequality=null;changes=true}}pointer++}if(changes){this.diff_cleanupMerge(diffs)}this.diff_cleanupSemanticLossless(diffs)};diff_match_patch.prototype.diff_cleanupSemanticLossless=function(diffs){function diff_cleanupSemanticScore(one,two,three){var whitespace=/\s/;var score=0;if(one.charAt(one.length-1).match(whitespace)||two.charAt(0).match(whitespace)){score++}if(two.charAt(two.length-1).match(whitespace)||three.charAt(0).match(whitespace)){score++}return score}var pointer=1;while(pointer<diffs.length-1){if(diffs[pointer-1][0]==DIFF_EQUAL&&diffs[pointer+1][0]==DIFF_EQUAL){var equality1=diffs[pointer-1][1];var edit=diffs[pointer][1];var equality2=diffs[pointer+1][1];var commonOffset=this.diff_commonSuffix(equality1,edit);if(commonOffset){var commonString=edit.substring(edit.length-commonOffset);equality1=equality1.substring(0,equality1.length-commonOffset);edit=commonString+edit.substring(0,edit.length-commonOffset);equality2=commonString+equality2}var bestEquality1=equality1;var bestEdit=edit;var bestEquality2=equality2;var bestScore=diff_cleanupSemanticScore(equality1,edit,equality2);while(edit.charAt(0)===equality2.charAt(0)){equality1+=edit.charAt(0);edit=edit.substring(1)+equality2.charAt(0);equality2=equality2.substring(1);var score=diff_cleanupSemanticScore(equality1,edit,equality2);if(score>=bestScore){bestScore=score;bestEquality1=equality1;bestEdit=edit;bestEquality2=equality2}}if(diffs[pointer-1][1]!=bestEquality1){diffs[pointer-1][1]=bestEquality1;diffs[pointer][1]=bestEdit;diffs[pointer+1][1]=bestEquality2}}pointer++}};diff_match_patch.prototype.diff_cleanupEfficiency=function(diffs){var changes=false;var equalities=[];var lastequality='';var pointer=0;var pre_ins=false;var pre_del=false;var post_ins=false;var post_del=false;while(pointer<diffs.length){if(diffs[pointer][0]==DIFF_EQUAL){if(diffs[pointer][1].length<this.Diff_EditCost&&(post_ins||post_del)){equalities.push(pointer);pre_ins=post_ins;pre_del=post_del;lastequality=diffs[pointer][1]}else{equalities=[];lastequality=''}post_ins=post_del=false}else{if(diffs[pointer][0]==DIFF_DELETE){post_del=true}else{post_ins=true}if(lastequality&&((pre_ins&&pre_del&&post_ins&&post_del)||((lastequality.length<this.Diff_EditCost/2)&&(pre_ins+pre_del+post_ins+post_del)==3))){diffs.splice(equalities[equalities.length-1],0,[DIFF_DELETE,lastequality]);diffs[equalities[equalities.length-1]+1][0]=DIFF_INSERT;equalities.pop();lastequality='';if(pre_ins&&pre_del){post_ins=post_del=true;equalities=[]}else{equalities.pop();pointer=equalities.length?equalities[equalities.length-1]:-1;post_ins=post_del=false}changes=true}}pointer++}if(changes){this.diff_cleanupMerge(diffs)}};diff_match_patch.prototype.diff_cleanupMerge=function(diffs){diffs.push([DIFF_EQUAL,'']);var pointer=0;var count_delete=0;var count_insert=0;var text_delete='';var text_insert='';var commonlength;while(pointer<diffs.length){if(diffs[pointer][0]==DIFF_INSERT){count_insert++;text_insert+=diffs[pointer][1];pointer++}else if(diffs[pointer][0]==DIFF_DELETE){count_delete++;text_delete+=diffs[pointer][1];pointer++}else{if(count_delete!==0||count_insert!==0){if(count_delete!==0&&count_insert!==0){commonlength=this.diff_commonPrefix(text_insert,text_delete);if(commonlength!==0){if((pointer-count_delete-count_insert)>0&&diffs[pointer-count_delete-count_insert-1][0]==DIFF_EQUAL){diffs[pointer-count_delete-count_insert-1][1]+=text_insert.substring(0,commonlength)}else{diffs.splice(0,0,[DIFF_EQUAL,text_insert.substring(0,commonlength)]);pointer++}text_insert=text_insert.substring(commonlength);text_delete=text_delete.substring(commonlength)}commonlength=this.diff_commonSuffix(text_insert,text_delete);if(commonlength!==0){diffs[pointer][1]=text_insert.substring(text_insert.length-commonlength)+diffs[pointer][1];text_insert=text_insert.substring(0,text_insert.length-commonlength);text_delete=text_delete.substring(0,text_delete.length-commonlength)}}if(count_delete===0){diffs.splice(pointer-count_delete-count_insert,count_delete+count_insert,[DIFF_INSERT,text_insert])}else if(count_insert===0){diffs.splice(pointer-count_delete-count_insert,count_delete+count_insert,[DIFF_DELETE,text_delete])}else{diffs.splice(pointer-count_delete-count_insert,count_delete+count_insert,[DIFF_DELETE,text_delete],[DIFF_INSERT,text_insert])}pointer=pointer-count_delete-count_insert+(count_delete?1:0)+(count_insert?1:0)+1}else if(pointer!==0&&diffs[pointer-1][0]==DIFF_EQUAL){diffs[pointer-1][1]+=diffs[pointer][1];diffs.splice(pointer,1)}else{pointer++}count_insert=0;count_delete=0;text_delete='';text_insert=''}}if(diffs[diffs.length-1][1]===''){diffs.pop()}var changes=false;pointer=1;while(pointer<diffs.length-1){if(diffs[pointer-1][0]==DIFF_EQUAL&&diffs[pointer+1][0]==DIFF_EQUAL){if(diffs[pointer][1].substring(diffs[pointer][1].length-diffs[pointer-1][1].length)==diffs[pointer-1][1]){diffs[pointer][1]=diffs[pointer-1][1]+diffs[pointer][1].substring(0,diffs[pointer][1].length-diffs[pointer-1][1].length);diffs[pointer+1][1]=diffs[pointer-1][1]+diffs[pointer+1][1];diffs.splice(pointer-1,1);changes=true}else if(diffs[pointer][1].substring(0,diffs[pointer+1][1].length)==diffs[pointer+1][1]){diffs[pointer-1][1]+=diffs[pointer+1][1];diffs[pointer][1]=diffs[pointer][1].substring(diffs[pointer+1][1].length)+diffs[pointer+1][1];diffs.splice(pointer+1,1);changes=true}}pointer++}if(changes){this.diff_cleanupMerge(diffs)}};diff_match_patch.prototype.diff_addIndex=function(diffs){var i=0;for(var x=0;x<diffs.length;x++){diffs[x].push(i);if(diffs[x][0]!==DIFF_DELETE){i+=diffs[x][1].length}}};diff_match_patch.prototype.diff_xIndex=function(diffs,loc){var chars1=0;var chars2=0;var last_chars1=0;var last_chars2=0;var x;for(x=0;x<diffs.length;x++){if(diffs[x][0]!==DIFF_INSERT){chars1+=diffs[x][1].length}if(diffs[x][0]!==DIFF_DELETE){chars2+=diffs[x][1].length}if(chars1>loc){break}last_chars1=chars1;last_chars2=chars2}if(diffs.length!=x&&diffs[x][0]===DIFF_DELETE){return last_chars2}return last_chars2+(loc-last_chars1)};diff_match_patch.prototype.diff_prettyHtml=function(diffs){this.diff_addIndex(diffs);var html='';for(var x=0;x<diffs.length;x++){var m=diffs[x][0];var t=diffs[x][1];var i=diffs[x][2];t=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');t=t.replace(/\n/g,'&para;<BR>');if(m===DIFF_DELETE){html+='<DEL STYLE="background:#FFE6E6;" TITLE="i='+i+'">'+t+'</DEL>'}else if(m===DIFF_INSERT){html+='<INS STYLE="background:#E6FFE6;" TITLE="i='+i+'">'+t+'</INS>'}else{html+='<SPAN TITLE="i='+i+'">'+t+'</SPAN>'}}return html};diff_match_patch.prototype.match_main=function(text,pattern,loc){loc=Math.max(0,Math.min(loc,text.length-pattern.length));if(text==pattern){return 0}else if(text.length===0){return null}else if(text.substring(loc,loc+pattern.length)==pattern){return loc}else{return this.match_bitap(text,pattern,loc)}};diff_match_patch.prototype.match_bitap=function(text,pattern,loc){if(pattern.length>this.Match_MaxBits){return alert('Pattern too long for this browser.')}var s=this.match_alphabet(pattern);var score_text_length=text.length;score_text_length=Math.max(score_text_length,this.Match_MinLength);score_text_length=Math.min(score_text_length,this.Match_MaxLength);var dmp=this;function match_bitapScore(e,x){var d=Math.abs(loc-x);return(e/pattern.length/dmp.Match_Balance)+(d/score_text_length/(1.0-dmp.Match_Balance))}var score_threshold=this.Match_Threshold;var best_loc=text.indexOf(pattern,loc);if(best_loc!=-1){score_threshold=Math.min(match_bitapScore(0,best_loc),score_threshold)}best_loc=text.lastIndexOf(pattern,loc+pattern.length);if(best_loc!=-1){score_threshold=Math.min(match_bitapScore(0,best_loc),score_threshold)}var matchmask=1<<(pattern.length-1);best_loc=null;var bin_min,bin_mid;var bin_max=Math.max(loc+loc,text.length);var last_rd;for(var d=0;d<pattern.length;d++){var rd=Array(text.length);bin_min=loc;bin_mid=bin_max;while(bin_min<bin_mid){if(match_bitapScore(d,bin_mid)<score_threshold){bin_min=bin_mid}else{bin_max=bin_mid}bin_mid=Math.floor((bin_max-bin_min)/2+bin_min)}bin_max=bin_mid;var start=Math.max(0,loc-(bin_mid-loc)-1);var finish=Math.min(text.length-1,pattern.length+bin_mid);if(text.charAt(finish)==pattern.charAt(pattern.length-1)){rd[finish]=(1<<(d+1))-1}else{rd[finish]=(1<<d)-1}for(var j=finish-1;j>=start;j--){if(d===0){rd[j]=((rd[j+1]<<1)|1)&s[text.charAt(j)]}else{rd[j]=((rd[j+1]<<1)|1)&s[text.charAt(j)]|((last_rd[j+1]<<1)|1)|((last_rd[j]<<1)|1)|last_rd[j+1]}if(rd[j]&matchmask){var score=match_bitapScore(d,j);if(score<=score_threshold){score_threshold=score;best_loc=j;if(j>loc){start=Math.max(0,loc-(j-loc))}else{break}}}}if(match_bitapScore(d+1,loc)>score_threshold){break}last_rd=rd}return best_loc};diff_match_patch.prototype.match_alphabet=function(pattern){var s=Object();for(var i=0;i<pattern.length;i++){s[pattern.charAt(i)]=0}for(var i=0;i<pattern.length;i++){s[pattern.charAt(i)]|=1<<(pattern.length-i-1)}return s};diff_match_patch.prototype.patch_addContext=function(patch,text){var pattern=text.substring(patch.start2,patch.start2+patch.length1);var padding=0;while(text.indexOf(pattern)!=text.lastIndexOf(pattern)&&pattern.length<this.Match_MaxBits-this.Patch_Margin-this.Patch_Margin){padding+=this.Patch_Margin;pattern=text.substring(patch.start2-padding,patch.start2+patch.length1+padding)}padding+=this.Patch_Margin;var prefix=text.substring(patch.start2-padding,patch.start2);if(prefix!==''){patch.diffs.unshift([DIFF_EQUAL,prefix])}var suffix=text.substring(patch.start2+patch.length1,patch.start2+patch.length1+padding);if(suffix!==''){patch.diffs.push([DIFF_EQUAL,suffix])}patch.start1-=prefix.length;patch.start2-=prefix.length;patch.length1+=prefix.length+suffix.length;patch.length2+=prefix.length+suffix.length};diff_match_patch.prototype.patch_make=function(text1,text2,opt_diffs){var diffs;if(typeof opt_diffs!='undefined'){diffs=opt_diffs}else{diffs=this.diff_main(text1,text2,true);if(diffs.length>2){this.diff_cleanupSemantic(diffs);this.diff_cleanupEfficiency(diffs)}}if(diffs.length===0){return[]}var patches=[];var patch=new patch_obj();var char_count1=0;var char_count2=0;var prepatch_text=text1;var postpatch_text=text1;for(var x=0;x<diffs.length;x++){var diff_type=diffs[x][0];var diff_text=diffs[x][1];if(patch.diffs.length===0&&diff_type!==DIFF_EQUAL){patch.start1=char_count1;patch.start2=char_count2}if(diff_type===DIFF_INSERT){patch.diffs.push(diffs[x]);patch.length2+=diff_text.length;postpatch_text=postpatch_text.substring(0,char_count2)+diff_text+postpatch_text.substring(char_count2)}else if(diff_type===DIFF_DELETE){patch.length1+=diff_text.length;patch.diffs.push(diffs[x]);postpatch_text=postpatch_text.substring(0,char_count2)+postpatch_text.substring(char_count2+diff_text.length)}else if(diff_type===DIFF_EQUAL&&diff_text.length<=2*this.Patch_Margin&&patch.diffs.length!==0&&diffs.length!=x+1){patch.diffs.push(diffs[x]);patch.length1+=diff_text.length;patch.length2+=diff_text.length}if(diff_type===DIFF_EQUAL&&diff_text.length>=2*this.Patch_Margin){if(patch.diffs.length!==0){this.patch_addContext(patch,prepatch_text);patches.push(patch);patch=new patch_obj();prepatch_text=postpatch_text}}if(diff_type!==DIFF_INSERT){char_count1+=diff_text.length}if(diff_type!==DIFF_DELETE){char_count2+=diff_text.length}}if(patch.diffs.length!==0){this.patch_addContext(patch,prepatch_text);patches.push(patch)}return patches};diff_match_patch.prototype.patch_apply=function(patches,text){this.patch_splitMax(patches);var results=[];var delta=0;for(var x=0;x<patches.length;x++){var expected_loc=patches[x].start2+delta;var text1=patches[x].text1();var start_loc=this.match_main(text,text1,expected_loc);if(start_loc===null){results.push(false)}else{results.push(true);delta=start_loc-expected_loc;var text2=text.substring(start_loc,start_loc+text1.length);if(text1==text2){text=text.substring(0,start_loc)+patches[x].text2()+text.substring(start_loc+text1.length)}else{var diffs=this.diff_main(text1,text2,false);this.diff_cleanupSemanticLossless(diffs);var index1=0;var index2;for(var y=0;y<patches[x].diffs.length;y++){var mod=patches[x].diffs[y];if(mod[0]!==DIFF_EQUAL){index2=this.diff_xIndex(diffs,index1)}if(mod[0]===DIFF_INSERT){text=text.substring(0,start_loc+index2)+mod[1]+text.substring(start_loc+index2)}else if(mod[0]===DIFF_DELETE){text=text.substring(0,start_loc+index2)+text.substring(start_loc+this.diff_xIndex(diffs,index1+mod[1].length))}if(mod[0]!==DIFF_DELETE){index1+=mod[1].length}}}}}return[text,results]};diff_match_patch.prototype.patch_splitMax=function(patches){for(var x=0;x<patches.length;x++){if(patches[x].length1>this.Match_MaxBits){var bigpatch=patches[x];patches.splice(x,1);var patch_size=this.Match_MaxBits;var start1=bigpatch.start1;var start2=bigpatch.start2;var precontext='';while(bigpatch.diffs.length!==0){var patch=new patch_obj();var empty=true;patch.start1=start1-precontext.length;patch.start2=start2-precontext.length;if(precontext!==''){patch.length1=patch.length2=precontext.length;patch.diffs.push([DIFF_EQUAL,precontext])}while(bigpatch.diffs.length!==0&&patch.length1<patch_size-this.Patch_Margin){var diff_type=bigpatch.diffs[0][0];var diff_text=bigpatch.diffs[0][1];if(diff_type===DIFF_INSERT){patch.length2+=diff_text.length;start2+=diff_text.length;patch.diffs.push(bigpatch.diffs.shift());empty=false}else{diff_text=diff_text.substring(0,patch_size-patch.length1-this.Patch_Margin);patch.length1+=diff_text.length;start1+=diff_text.length;if(diff_type===DIFF_EQUAL){patch.length2+=diff_text.length;start2+=diff_text.length}else{empty=false}patch.diffs.push([diff_type,diff_text]);if(diff_text==bigpatch.diffs[0][1]){bigpatch.diffs.shift()}else{bigpatch.diffs[0][1]=bigpatch.diffs[0][1].substring(diff_text.length)}}}precontext=patch.text2();precontext=precontext.substring(precontext.length-this.Patch_Margin);var postcontext=bigpatch.text1().substring(0,this.Patch_Margin);if(postcontext!==''){patch.length1+=postcontext.length;patch.length2+=postcontext.length;if(patch.diffs.length!==0&&patch.diffs[patch.diffs.length-1][0]===DIFF_EQUAL){patch.diffs[patch.diffs.length-1][1]+=postcontext}else{patch.diffs.push([DIFF_EQUAL,postcontext])}}if(!empty){patches.splice(x++,0,patch)}}}}};diff_match_patch.prototype.patch_toText=function(patches){var text='';for(var x=0;x<patches.length;x++){text+=patches[x]}return text};diff_match_patch.prototype.patch_fromText=function(textline){var patches=[];var text=textline.split('\n');while(text.length!==0){var m=text[0].match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/);if(!m){return alert('Invalid patch string:\n'+text[0])}var patch=new patch_obj();patches.push(patch);patch.start1=parseInt(m[1],10);if(m[2]===''){patch.start1--;patch.length1=1}else if(m[2]=='0'){patch.length1=0}else{patch.start1--;patch.length1=parseInt(m[2],10)}patch.start2=parseInt(m[3],10);if(m[4]===''){patch.start2--;patch.length2=1}else if(m[4]=='0'){patch.length2=0}else{patch.start2--;patch.length2=parseInt(m[4],10)}text.shift();while(text.length!==0){var sign=text[0].charAt(0);var line=decodeURIComponent(text[0].substring(1));if(sign=='-'){patch.diffs.push([DIFF_DELETE,line])}else if(sign=='+'){patch.diffs.push([DIFF_INSERT,line])}else if(sign==' '){patch.diffs.push([DIFF_EQUAL,line])}else if(sign=='@'){break}else if(sign===''){}else{return alert('Invalid patch mode: "'+sign+'"\n'+line)}text.shift()}}return patches};function patch_obj(){this.diffs=[];this.start1=null;this.start2=null;this.length1=0;this.length2=0}patch_obj.prototype.toString=function(){var coords1,coords2;if(this.length1===0){coords1=this.start1+',0'}else if(this.length1==1){coords1=this.start1+1}else{coords1=(this.start1+1)+','+this.length1}if(this.length2===0){coords2=this.start2+',0'}else if(this.length2==1){coords2=this.start2+1}else{coords2=(this.start2+1)+','+this.length2}var txt='@@ -'+coords1+' +'+coords2+' @@\n';for(var x=0;x<this.diffs.length;x++){switch(this.diffs[x][0]){case DIFF_DELETE:txt+='-';break;case DIFF_EQUAL:txt+=' ';break;case DIFF_INSERT:txt+='+';break;default:alert('Invalid diff operation in patch_obj.toString()')}txt+=encodeURI(this.diffs[x][1])+'\n'}return txt.replace(/%20/g,' ')};patch_obj.prototype.text1=function(){var txt='';for(var x=0;x<this.diffs.length;x++){if(this.diffs[x][0]!==DIFF_INSERT){txt+=this.diffs[x][1]}}return txt};patch_obj.prototype.text2=function(){var txt='';for(var x=0;x<this.diffs.length;x++){if(this.diffs[x][0]!==DIFF_DELETE){txt+=this.diffs[x][1]}}return txt};

var JSSpec = {
	specs: [],
	
	EMPTY_FUNCTION: function(){},
	
	Browser: {
		Trident: navigator.appName == "Microsoft Internet Explorer",
		Webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
		Presto: navigator.appName == "Opera"
	}
};

/**
 * Executor
 */

JSSpec.Executor = function(target, onSuccess, onException){
	this.target = target;
	this.onSuccess = typeof onSuccess == 'function' ? onSuccess : JSSpec.EMPTY_FUNCTION;
	this.onException = typeof onException == 'function' ? onException : JSSpec.EMPTY_FUNCTION;
	
	if(JSSpec.Browser.Trident){
		// Exception handler for Trident. It helps to collect exact line number where exception occured.
		window.onerror = function(message, fileName, lineNumber){
			var self = window._curExecutor;
			var ex = {message:message, fileName:fileName, lineNumber:lineNumber};

			if(JSSpec._secondPass)  {
				ex = self.mergeExceptions(JSSpec._assertionFailure, ex);
				delete JSSpec._secondPass;
				delete JSSpec._assertionFailure;
				
				ex.type = "failure";
				self.onException(self, ex);
			} else if(JSSpec._assertionFailure){
				JSSpec._secondPass = true;
				self.run();
			} else {
				self.onException(self, ex);
			}
			
			return true;
		};
	}
};

JSSpec.Executor.prototype.mergeExceptions = function(assertionFailure, normalException){
	var merged = {
		message:assertionFailure.message,
		fileName:normalException.fileName,
		lineNumber:normalException.lineNumber
	};
	
	return merged;
};

JSSpec.Executor.prototype.run = function(){
	this.local = window.temp;
	var self = this;
	var target = this.target;
	var onSuccess = this.onSuccess;
	var onException = this.onException;
	
	window.setTimeout(
		function(){
			var result;
			if(JSSpec.Browser.Trident){
				window._curExecutor = self;
				
				result = self.target();
				self.onSuccess(self, result);
			} else {
				try {
					result = self.target();
					self.onSuccess(self, result);
				} catch(ex){
					if(JSSpec.Browser.Webkit) ex = {message:ex.message, fileName:ex.sourceURL, lineNumber:ex.line};
					
					if(JSSpec._secondPass)  {
						ex = self.mergeExceptions(JSSpec._assertionFailure, ex);
						delete JSSpec._secondPass;
						delete JSSpec._assertionFailure;
						
						ex.type = "failure";
						self.onException(self, ex);
					} else if(JSSpec._assertionFailure){
						JSSpec._secondPass = true;
						self.run();
					} else {
						self.onException(self, ex);
					}
				}
			}
		},
		0
	);
};



/**
 * CompositeExecutor composites one or more executors and execute them sequencially.
 */
JSSpec.CompositeExecutor = function(onSuccess, onException, continueOnException){
	this.queue = [];
	this.onSuccess = typeof onSuccess == 'function' ? onSuccess : JSSpec.EMPTY_FUNCTION;
	this.onException = typeof onException == 'function' ? onException : JSSpec.EMPTY_FUNCTION;
	this.continueOnException = !!continueOnException;
};

JSSpec.CompositeExecutor.prototype.addFunction = function(func){
	this.addExecutor(new JSSpec.Executor(func));
};

JSSpec.CompositeExecutor.prototype.addExecutor = function(executor){
	var last = this.queue.length == 0 ? null : this.queue[this.queue.length - 1];
	if(last){
		last.next = executor;
	}
	
	executor.parent = this;
	executor.onSuccessBackup = executor.onSuccess;
	executor.onSuccess = function(result){
		this.onSuccessBackup(result);
		if(this.next){
			this.next.run();
		} else {
			this.parent.onSuccess();
		}
	};
	executor.onExceptionBackup = executor.onException;
	executor.onException = function(executor, ex){
		this.onExceptionBackup(executor, ex);

		if(this.parent.continueOnException){
			if(this.next){
				this.next.run();
			} else {
				this.parent.onSuccess();
			}
		} else {
			this.parent.onException(executor, ex);
		}
	};

	this.queue.push(executor);
};

JSSpec.CompositeExecutor.prototype.run = function(){
	if(this.queue.length > 0){
		this.queue[0].run();
	}
};

/**
 * Spec is a set of Examples in a specific context
 */

JSSpec.Spec = function(context, entries){
	this.id = JSSpec.Spec.id++;
	this.context = context;
	this.url = location.href;
	this.filterEntriesByEmbeddedExpressions(entries);
	this.extractOutSpecialEntries(entries);
	this.examples = this.makeExamplesFromEntries(entries);
	this.examplesMap = this.makeMapFromExamples(this.examples);
};

JSSpec.Spec.id = 0;
JSSpec.Spec.prototype.getExamples = function(){
	return this.examples;
};

JSSpec.Spec.prototype.hasException = function(){
	return this.getTotalFailures() > 0 || this.getTotalErrors() > 0;
};

JSSpec.Spec.prototype.getTotalFailures = function(){
	var examples = this.examples;
	var failures = 0;
	for(var i = 0; i < examples.length; i++){
		if(examples[i].isFailure()) failures++;
	}
	return failures;
};

JSSpec.Spec.prototype.getTotalErrors = function(){
	var examples = this.examples;
	var errors = 0;
	for(var i = 0; i < examples.length; i++){
		if(examples[i].isError()) errors++;
	}
	return errors;
};

JSSpec.Spec.prototype.filterEntriesByEmbeddedExpressions = function(entries){
	var isTrue;
	for(name in entries){
		var m = name.match(/\[\[(.+)\]\]/);
		if(m && m[1]){
			eval("isTrue = (" + m[1] + ")");
			if(!isTrue) delete entries[name];
		}
	}
};

JSSpec.Spec.prototype.extractOutSpecialEntries = function(entries){
	this.beforeEach = JSSpec.EMPTY_FUNCTION;
	this.beforeAll = JSSpec.EMPTY_FUNCTION;
	this.afterEach = JSSpec.EMPTY_FUNCTION;
	this.afterAll = JSSpec.EMPTY_FUNCTION;
	
	for(name in entries){
		if(name == 'before' || name == 'before each'){
			this.beforeEach = entries[name];
		} else if(name == 'before all' || name == 'before_all'){
			this.beforeAll = entries[name];
		} else if(name == 'after' || name == 'after each'){
			this.afterEach = entries[name];
		} else if(name == 'after all' || name == 'after_all'){
			this.afterAll = entries[name];
		}
	}
	
	delete entries['before'];
	delete entries['before each'];
	delete entries['before all'];
	delete entries['before_all'];
	delete entries['after'];
	delete entries['after each'];
	delete entries['after all'];
	delete entries['after_all'];
};

JSSpec.Spec.prototype.makeExamplesFromEntries = function(entries){
	var examples = [];
	for(name in entries){
		examples.push(new JSSpec.Example(name, entries[name], this.beforeEach, this.afterEach));
	}
	return examples;
};

JSSpec.Spec.prototype.makeMapFromExamples = function(examples){
	var map = {};
	for(var i = 0; i < examples.length; i++){
		var example = examples[i];
		map[example.id] = examples[i];
	}
	return map;
};

JSSpec.Spec.prototype.getExampleById = function(id){
	return this.examplesMap[id];
};

JSSpec.Spec.prototype.getExecutor = function(){
	var self = this;
	var onException = function(executor, ex){
		self.exception = ex;
	};
	
	var composite = new JSSpec.CompositeExecutor();
	composite.addFunction(function(){JSSpec.log.onSpecStart(self);});
	composite.addExecutor(new JSSpec.Executor(this.beforeAll, null, function(exec, ex){
		self.exception = ex;
		JSSpec.log.onSpecEnd(self);
	}));
	
	var exampleAndAfter = new JSSpec.CompositeExecutor(null,null,true);
	for(var i = 0; i < this.examples.length; i++){
		exampleAndAfter.addExecutor(this.examples[i].getExecutor());
	}
	exampleAndAfter.addExecutor(new JSSpec.Executor(this.afterAll, null, onException));
	exampleAndAfter.addExecutor(new JSSpec.Executor(function(){window.temp = {};}, null, onException));
	exampleAndAfter.addFunction(function(){JSSpec.log.onSpecEnd(self);});
	composite.addExecutor(exampleAndAfter);
	
	return composite;
};

/**
 * Example
 */
JSSpec.Example = function(name, target, before, after){
	this.id = JSSpec.Example.id++;
	this.name = name;
	this.target = target;
	this.before = before;
	this.after = after;
};

JSSpec.Example.id = 0;
JSSpec.Example.prototype.isFailure = function(){
	return this.exception && this.exception.type && this.exception.type == "failure";
};

JSSpec.Example.prototype.isError = function(){
	return this.exception && !this.exception.type;
};

JSSpec.Example.prototype.getExecutor = function(){
	var self = this;
	var onException = function(executor, ex){
		self.exception = ex;
	};
	
	var composite = new JSSpec.CompositeExecutor();
	composite.addFunction(function(){JSSpec.log.onExampleStart(self);});
	composite.addExecutor(new JSSpec.Executor(this.before, null, function(exec, ex){
		self.exception = ex;
		JSSpec.log.onExampleEnd(self);
	}));
	
	var targetAndAfter = new JSSpec.CompositeExecutor(null,null,true);
	
	targetAndAfter.addExecutor(new JSSpec.Executor(this.target, null, onException));
	targetAndAfter.addExecutor(new JSSpec.Executor(this.after, null, onException));
	targetAndAfter.addFunction(function(){JSSpec.log.onExampleEnd(self);});
	
	composite.addExecutor(targetAndAfter);
	
	return composite;
};

/**
 * Runner
 */

JSSpec.Runner = function(specs, logger){
	JSSpec.log = logger;
	
	this.totalExamples = 0;
	this.specs = [];
	this.specsMap = {};
	this.addAllSpecs(specs);
};

JSSpec.Runner.prototype.addAllSpecs = function(specs){
	for(var i = 0; i < specs.length; i++){
		this.addSpec(specs[i]);
	}
};

JSSpec.Runner.prototype.addSpec = function(spec){
	this.specs.push(spec);
	this.specsMap[spec.id] = spec;
	this.totalExamples += spec.getExamples().length;
};

JSSpec.Runner.prototype.getSpecById = function(id){
	return this.specsMap[id];
};

JSSpec.Runner.prototype.getSpecByContext = function(context){
	for(var i = 0; i < this.specs.length; i++){
		if(this.specs[i].context == context) return this.specs[i];
	}
	return null;
};

JSSpec.Runner.prototype.getSpecs = function(){
	return this.specs;
};

JSSpec.Runner.prototype.hasException = function(){
	return this.getTotalFailures() > 0 || this.getTotalErrors() > 0;
};

JSSpec.Runner.prototype.getTotalFailures = function(){
	var specs = this.specs;
	var failures = 0;
	for(var i = 0; i < specs.length; i++){
		failures += specs[i].getTotalFailures();
	}
	return failures;
};

JSSpec.Runner.prototype.getTotalErrors = function(){
	var specs = this.specs;
	var errors = 0;
	for(var i = 0; i < specs.length; i++){
		errors += specs[i].getTotalErrors();
	}
	return errors;
};

JSSpec.Runner.prototype.run = function(){
	JSSpec.log.onRunnerStart();
	this.executor = new JSSpec.CompositeExecutor(function(){JSSpec.log.onRunnerEnd();},null,true);
	for(var i = 0; i < this.specs.length; i++){
		this.executor.addExecutor(this.specs[i].getExecutor());
	}
};

JSSpec.Runner.prototype.rerun = function(context){
	JSSpec.runner = new JSSpec.Runner([this.getSpecByContext(context)], JSSpec.log);
	JSSpec.runner.run();
};

/**
 * Logger
 */

JSSpec.Logger = function(){
	this.finishedExamples = 0;
	this.startedAt = null;
};

JSSpec.Logger.prototype.onRunnerStart = function(){
	this.startedAt = new Date();
	var container = document.getElementById('jsspec_container');
	if(container){
		container.innerHTML = "";
	} else {
		container = document.createElement("DIV");
		container.id = "jsspec_container";
		document.body.appendChild(container);
	}
	
	var title = document.createElement("DIV");
	title.id = "title";
	title.innerHTML = [
		'<h1>JSSpec <span>Runner</span></h1>',
		'<ul>',
		'	<li><span id="total_examples">' + JSSpec.runner.totalExamples + '</span> examples</li>',
		'	<li><span id="total_failures">0</span> failures</li>',
		'	<li><span id="total_errors">0</span> errors</li>',
		'	<li><span id="progress">0</span>% done</li>',
		'	<li><span id="total_elapsed">0</span> secs</li>',
		'</ul>'
	].join("");
	container.appendChild(title);

	var list = document.createElement("DIV");
	list.id = "list";
	list.innerHTML = [
		'<h2 id="runner">Run All Examples</h2>',
		'<h2>List</h2>',
		'<ul class="specs">',
		function(){
			var specs = JSSpec.runner.getSpecs();
			var sb = [];
			for(var i = 0; i < specs.length; i++){
				var spec = specs[i];
				sb.push('<li id="spec_' + specs[i].id + '_list"><h3><a href="#spec_' + specs[i].id + '">' + specs[i].context + '</a></h3></li>');
			}
			return sb.join("");
		}(),
		'</ul>'
	].join("");
	container.appendChild(list);
	
	var log = document.createElement("DIV");
	log.id = "log";
	log.innerHTML = [
		'<h2>Log</h2>',
		'<ul class="specs">',
		function(){
			var specs = JSSpec.runner.getSpecs();
			var sb = [];
			for(var i = 0; i < specs.length; i++){
				var spec = specs[i];
				sb.push('	<li id="spec_' + specs[i].id + '">');
				sb.push('		<h3>' + specs[i].context + '</h3>');
				sb.push('		<ul id="spec_' + specs[i].id + '_examples" class="examples">');
				for(var j = 0; j < spec.examples.length; j++){
					var example = spec.examples[j];
					sb.push('			<li id="example_' + example.id + '">');
					sb.push('				<h4>' + example.name.replace(/_/g, ' ') + '</h4>');
					sb.push('			</li>');
				}
				sb.push('		</ul>');
				sb.push('	</li>');
			}
			return sb.join("");
		}(),
		'</ul>'
	].join("");
	container.appendChild(log);
	
	var foot = document.createElement("DIV");
	foot.innerHTML = '<p class="footer">powered by <a href="http://jania.pe.kr/aw/moin.cgi/JSSpec">JSSpec</a></p>';
	container.appendChild(foot);
};

JSSpec.Logger.prototype.onRunnerEnd = function(){
	
};

JSSpec.Logger.prototype.onSpecStart = function(spec){
	var spec_list = document.getElementById("spec_" + spec.id + "_list");
	var spec_log = document.getElementById("spec_" + spec.id);
	
	spec_list.className = "ongoing";
	spec_log.className = "ongoing";
};

JSSpec.Logger.prototype.onSpecEnd = function(spec){
	var spec_list = document.getElementById("spec_" + spec.id + "_list");
	var spec_log = document.getElementById("spec_" + spec.id);
	var examples = document.getElementById("spec_" + spec.id + "_examples");
	var className = spec.hasException() ? "exception" : "success";

	spec_list.className = className;
	spec_log.className = className;

	if(JSSpec.options.autocollapse && !spec.hasException()) examples.style.display = "none";
	
	if(spec.exception){
		heading.appendChild(document.createTextNode(" - " + spec.exception.message));
	}
};

JSSpec.Logger.prototype.onExampleStart = function(example){
	var li = document.getElementById("example_" + example.id);
	li.className = "ongoing";
};

JSSpec.Logger.prototype.onExampleEnd = function(example){
	var li = document.getElementById("example_" + example.id);
	li.className = example.exception ? "exception" : "success";
	
	if(example.exception){
		var div = document.createElement("DIV");
		div.innerHTML = example.exception.message + "<p class='uri'><br />" + " at " + example.exception.fileName + ", line " + example.exception.lineNumber + "</p>";
		li.appendChild(div);
	}
	
	var title = document.getElementById("title");
	var runner = JSSpec.runner;
	
	title.className = runner.hasException() ? "exception" : "success";
	
	this.finishedExamples++;
	document.getElementById("total_failures").innerHTML = runner.getTotalFailures();
	document.getElementById("total_errors").innerHTML = runner.getTotalErrors();
	document.getElementById("progress").innerHTML = parseInt(this.finishedExamples / runner.totalExamples * 100);
	document.getElementById("total_elapsed").innerHTML = (new Date().getTime() - this.startedAt.getTime()) / 1000;
};

/**
 * IncludeMatcher
 */

JSSpec.IncludeMatcher = function(actual, expected, condition){
	this.actual = actual;
	this.expected = expected;
	this.condition = condition;
	this.match = false;
	this.explaination = this.makeExplain();
};

JSSpec.IncludeMatcher.createInstance = function(actual, expected, condition){
	return new JSSpec.IncludeMatcher(actual, expected, condition);
};

JSSpec.IncludeMatcher.prototype.matches = function(){
	return this.match;
};

JSSpec.IncludeMatcher.prototype.explain = function(){
	return this.explaination;
};

JSSpec.IncludeMatcher.prototype.makeExplain = function(){
	if(typeof this.actual.length == 'undefined'){
		return this.makeExplainForNotArray();
	} else {
		return this.makeExplainForArray();
	}
};

JSSpec.IncludeMatcher.prototype.makeExplainForNotArray = function(){
	var sb = [];
	sb.push('<p>actual value:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.actual) + '</p>');
	sb.push('<p>should ' + (this.condition ? '' : 'not') + ' include:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.expected) + '</p>');
	sb.push('<p>but since it\s not an array, include or not doesn\'t make any sense.</p>');
	return sb.join("");
};

JSSpec.IncludeMatcher.prototype.makeExplainForArray = function(){
	var matches;
	if(this.condition){
		for(var i = 0; i < this.actual.length; i++){
			matches = JSSpec.EqualityMatcher.createInstance(this.expected, this.actual[i]).matches();
			if(matches){
				this.match = true;
				break;
			}
		}
	} else {
		for(var j = 0; j < this.actual.length; j++){
			matches = JSSpec.EqualityMatcher.createInstance(this.expected, this.actual[j]).matches();
			if(matches){
				this.match = false;
				break;
			}
		}
	}
	
	if(this.match) return "";
	
	var sb = [];
	sb.push('<p>actual value:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.actual, false, this.condition ? null : i) + '</p>');
	sb.push('<p>should ' + (this.condition ? '' : 'not') + ' include:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.expected) + '</p>');
	return sb.join("");
};

/**
 * PropertyLengthMatcher
 */

JSSpec.PropertyLengthMatcher = function(num, property, o, condition){
	this.num = num;
	this.o = o;
	this.property = property;
	if((property == 'characters' || property == 'items') && typeof o.length != 'undefined'){
		this.property = 'length';
	}
	
	this.condition = condition;
	this.conditionMet = function(x){
		if(condition == 'exactly') return x.length == num;
		if(condition == 'at least') return x.length >= num;
		if(condition == 'at most') return x.length <= num;

		throw "Unknown condition '" + condition + "'";
	};
	this.match = false;
	this.explaination = this.makeExplain();
};

JSSpec.PropertyLengthMatcher.prototype.makeExplain = function(){
	
	if(this.o._type && this.o._type == 'String' && this.property == 'length'){
		this.match = this.conditionMet(this.o);
		return this.match ? '' : this.makeExplainForString();
	} else if(typeof this.o.length != 'undefined' && this.property == "length"){
		this.match = this.conditionMet(this.o);
		return this.match ? '' : this.makeExplainForArray();
	} else if(typeof this.o[this.property] != 'undefined' && this.o[this.property] != null){
		this.match = this.conditionMet(this.o[this.property]);
		return this.match ? '' : this.makeExplainForObject();
	} else if(typeof this.o[this.property] == 'undefined' || this.o[this.property] == null){
		this.match = false;
		return this.makeExplainForNoProperty();
	}

	this.match = true;
	
	return null;
};

JSSpec.PropertyLengthMatcher.prototype.makeExplainForString = function(){
	var sb = [];
	
	var exp = this.num == 0 ?
		'be an <strong>empty string</strong>' :
		'have <strong>' + this.condition + ' ' + this.num + ' characters</strong>';
	
	sb.push('<p>actual value has <strong>' + this.o.length + ' characters</strong>:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.o) + '</p>');
	sb.push('<p>but it should ' + exp + '.</p>');
	
	return sb.join("");
};

JSSpec.PropertyLengthMatcher.prototype.makeExplainForArray = function(){
	var sb = [];
	
	var exp = this.num == 0 ?
		'be an <strong>empty array</strong>' :
		'have <strong>' + this.condition + ' ' + this.num + ' items</strong>';

	sb.push('<p>actual value has <strong>' + this.o.length + ' items</strong>:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.o) + '</p>');
	sb.push('<p>but it should ' + exp + '.</p>');
	
	return sb.join("");
};

JSSpec.PropertyLengthMatcher.prototype.makeExplainForObject = function(){
	var sb = [];

	var exp = this.num == 0 ?
		'be <strong>empty</strong>' :
		'have <strong>' + this.condition + ' ' + this.num + ' ' + this.property + '.</strong>';

	sb.push('<p>actual value has <strong>' + this.o[this.property].length + ' ' + this.property + '</strong>:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.o, false, this.property) + '</p>');
	sb.push('<p>but it should ' + exp + '.</p>');
	
	return sb.join("");
};

JSSpec.PropertyLengthMatcher.prototype.makeExplainForNoProperty = function(){
	var sb = [];
	
	sb.push('<p>actual value:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.o) + '</p>');
	sb.push('<p>should have <strong>' + this.condition + ' ' + this.num + ' ' + this.property + '</strong> but there\'s no such property.</p>');
	
	return sb.join("");
};

JSSpec.PropertyLengthMatcher.prototype.matches = function(){
	return this.match;
};

JSSpec.PropertyLengthMatcher.prototype.explain = function(){
	return this.explaination;
};

JSSpec.PropertyLengthMatcher.createInstance = function(num, property, o, condition){
	return new JSSpec.PropertyLengthMatcher(num, property, o, condition);
};




/**
 * EqualityMatcher
 */

JSSpec.EqualityMatcher = {};

JSSpec.EqualityMatcher.createInstance = function(expected, actual){
	
	if(expected == null || actual == null){
		return new JSSpec.NullEqualityMatcher(expected, actual);
	} else if(expected._type && expected._type == actual._type){
		if(expected._type == "String"){
			return new JSSpec.StringEqualityMatcher(expected, actual);
		} else if(expected._type == "Date"){
			return new JSSpec.DateEqualityMatcher(expected, actual);
		} else if(expected._type == "Number"){
			return new JSSpec.NumberEqualityMatcher(expected, actual);
		} else if(expected._type == "Array"){
			return new JSSpec.ArrayEqualityMatcher(expected, actual);
		} else if(expected._type == "Boolean"){
			return new JSSpec.BooleanEqualityMatcher(expected, actual);
		}
	}
	
	return new JSSpec.ObjectEqualityMatcher(expected, actual);
};

JSSpec.EqualityMatcher.basicExplain = function(expected, actual, expectedDesc, actualDesc){
	var sb = [];
	
	sb.push(actualDesc || '<p>actual value:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(actual) + '</p>');
	sb.push(expectedDesc || '<p>should be:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(expected) + '</p>');
	
	return sb.join("");
};

JSSpec.EqualityMatcher.diffExplain = function(expected, actual){
	var sb = [];

	sb.push('<p>diff:</p>');
	sb.push('<p class="left">');
	
	var dmp = new diff_match_patch();
	var diff = dmp.diff_main(expected, actual);
	dmp.diff_cleanupEfficiency(diff);
	
	sb.push(JSSpec.util.inspect(dmp.diff_prettyHtml(diff), true));
	
	sb.push('</p>');
	
	return sb.join("");
};

/**
 * BooleanEqualityMatcher
 */

JSSpec.BooleanEqualityMatcher = function(expected, actual){
	this.expected = expected;
	this.actual = actual;
};

JSSpec.BooleanEqualityMatcher.prototype.explain = function(){
	var sb = [];
	
	sb.push('<p>actual value:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.actual) + '</p>');
	sb.push('<p>should be:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.expected) + '</p>');
	
	return sb.join("");
};

JSSpec.BooleanEqualityMatcher.prototype.matches = function(){
	return this.expected == this.actual;
};

/**
 * NullEqualityMatcher
 */

JSSpec.NullEqualityMatcher = function(expected, actual){
	this.expected = expected;
	this.actual = actual;
};

JSSpec.NullEqualityMatcher.prototype.matches = function(){
	return this.expected == this.actual && typeof this.expected == typeof this.actual;
};

JSSpec.NullEqualityMatcher.prototype.explain = function(){
	return JSSpec.EqualityMatcher.basicExplain(this.expected, this.actual);
};

JSSpec.DateEqualityMatcher = function(expected, actual){
	this.expected = expected;
	this.actual = actual;
};

JSSpec.DateEqualityMatcher.prototype.matches = function(){
	return this.expected.getTime() == this.actual.getTime();
};

JSSpec.DateEqualityMatcher.prototype.explain = function(){
	var sb = [];
	
	sb.push(JSSpec.EqualityMatcher.basicExplain(this.expected, this.actual));
	sb.push(JSSpec.EqualityMatcher.diffExplain(this.expected.toString(), this.actual.toString()));

	return sb.join("");
};

/**
 * ObjectEqualityMatcher
 */

JSSpec.ObjectEqualityMatcher = function(expected, actual){
	this.expected = expected;
	this.actual = actual;
	this.match = this.expected == this.actual;
	this.explaination = this.makeExplain();
};

JSSpec.ObjectEqualityMatcher.prototype.matches = function(){return this.match;};

JSSpec.ObjectEqualityMatcher.prototype.explain = function(){return this.explaination;};

JSSpec.ObjectEqualityMatcher.prototype.makeExplain = function(){
	if(this.expected == this.actual){
		this.match = true;
		return "";
	}
	
	if(JSSpec.util.isDomNode(this.expected)){
		return this.makeExplainForDomNode();
	}
	
	var key, expectedHasItem, actualHasItem;
	
	for(key in this.expected){
		expectedHasItem = this.expected[key] != null && typeof this.expected[key] != 'undefined';
		actualHasItem = this.actual[key] != null && typeof this.actual[key] != 'undefined';
		if(expectedHasItem && !actualHasItem) return this.makeExplainForMissingItem(key);
	}
	for(key in this.actual){
		expectedHasItem = this.expected[key] != null && typeof this.expected[key] != 'undefined';
		actualHasItem = this.actual[key] != null && typeof this.actual[key] != 'undefined';
		if(actualHasItem && !expectedHasItem) return this.makeExplainForUnknownItem(key);
	}
	
	for(key in this.expected){
		var matcher = JSSpec.EqualityMatcher.createInstance(this.expected[key], this.actual[key]);
		if(!matcher.matches()) return this.makeExplainForItemMismatch(key);
	}
		
	this.match = true;
	
	return null;
};

JSSpec.ObjectEqualityMatcher.prototype.makeExplainForDomNode = function(key){
	var sb = [];
	
	sb.push(JSSpec.EqualityMatcher.basicExplain(this.expected, this.actual));
	
	return sb.join("");
};

JSSpec.ObjectEqualityMatcher.prototype.makeExplainForMissingItem = function(key){
	var sb = [];

	sb.push('<p>actual value has no item named <strong>' + JSSpec.util.inspect(key) + '</strong></p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.actual, false, key) + '</p>');
	sb.push('<p>but it should have the item whose value is <strong>' + JSSpec.util.inspect(this.expected[key]) + '</strong></p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.expected, false, key) + '</p>');
	
	return sb.join("");
};

JSSpec.ObjectEqualityMatcher.prototype.makeExplainForUnknownItem = function(key){
	var sb = [];

	sb.push('<p>actual value has item named <strong>' + JSSpec.util.inspect(key) + '</strong></p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.actual, false, key) + '</p>');
	sb.push('<p>but there should be no such item</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.expected, false, key) + '</p>');
	
	return sb.join("");
};

JSSpec.ObjectEqualityMatcher.prototype.makeExplainForItemMismatch = function(key){
	var sb = [];

	sb.push('<p>actual value has an item named <strong>' + JSSpec.util.inspect(key) + '</strong> whose value is <strong>' + JSSpec.util.inspect(this.actual[key]) + '</strong></p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.actual, false, key) + '</p>');
	sb.push('<p>but it\'s value should be <strong>' + JSSpec.util.inspect(this.expected[key]) + '</strong></p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.expected, false, key) + '</p>');
	
	return sb.join("");
};

/**
 * ArrayEqualityMatcher
 */
JSSpec.ArrayEqualityMatcher = function(expected, actual){
	this.expected = expected;
	this.actual = actual;
	this.match = this.expected == this.actual;
	this.explaination = this.makeExplain();
};

JSSpec.ArrayEqualityMatcher.prototype.matches = function(){return this.match;};

JSSpec.ArrayEqualityMatcher.prototype.explain = function(){return this.explaination;};

JSSpec.ArrayEqualityMatcher.prototype.makeExplain = function(){
	if(this.expected.length != this.actual.length) return this.makeExplainForLengthMismatch();
	
	for(var i = 0; i < this.expected.length; i++){
		var matcher = JSSpec.EqualityMatcher.createInstance(this.expected[i], this.actual[i]);
		if(!matcher.matches()) return this.makeExplainForItemMismatch(i);
	}
		
	this.match = true;
	
	return null;
};

JSSpec.ArrayEqualityMatcher.prototype.makeExplainForLengthMismatch = function(){
	return JSSpec.EqualityMatcher.basicExplain(
		this.expected,
		this.actual,
		'<p>but it should be <strong>' + this.expected.length + '</strong></p>',
		'<p>actual value has <strong>' + this.actual.length + '</strong> items</p>'
	);
};

JSSpec.ArrayEqualityMatcher.prototype.makeExplainForItemMismatch = function(index){
	var postfix = ["th", "st", "nd", "rd", "th"][Math.min((index + 1) % 10,4)];
	
	var sb = [];

	sb.push('<p>' + (index + 1) + postfix + ' item (index ' + index + ') of actual value is <strong>' + JSSpec.util.inspect(this.actual[index]) + '</strong>:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.actual, false, index) + '</p>');
	sb.push('<p>but it should be <strong>' + JSSpec.util.inspect(this.expected[index]) + '</strong>:</p>');
	sb.push('<p class="left">' + JSSpec.util.inspect(this.expected, false, index) + '</p>');
	
	return sb.join("");
};

/**
 * NumberEqualityMatcher
 */

JSSpec.NumberEqualityMatcher = function(expected, actual){
	this.expected = expected;
	this.actual = actual;
};

JSSpec.NumberEqualityMatcher.prototype.matches = function(){
	return (this.expected == this.actual);
};

JSSpec.NumberEqualityMatcher.prototype.explain = function(){
	return JSSpec.EqualityMatcher.basicExplain(this.expected, this.actual);
};

/**
 * StringEqualityMatcher
 */

JSSpec.StringEqualityMatcher = function(expected, actual){
	this.expected = expected;
	this.actual = actual;
};

JSSpec.StringEqualityMatcher.prototype.matches = function(){
	return (this.expected == this.actual);
};

JSSpec.StringEqualityMatcher.prototype.explain = function(){
	var sb = [];

	sb.push(JSSpec.EqualityMatcher.basicExplain(this.expected, this.actual));
	sb.push(JSSpec.EqualityMatcher.diffExplain(this.expected, this.actual));	
	return sb.join("");
};

/**
 * PatternMatcher
 */

JSSpec.PatternMatcher = function(actual, pattern, condition){
	this.actual = actual;
	this.pattern = pattern;
	this.condition = condition;
	this.match = false;
	this.explaination = this.makeExplain();
};

JSSpec.PatternMatcher.createInstance = function(actual, pattern, condition){
	return new JSSpec.PatternMatcher(actual, pattern, condition);
};

JSSpec.PatternMatcher.prototype.makeExplain = function(){
	var sb;
	if(this.actual == null || this.actual._type != 'String'){
		sb = [];
		sb.push('<p>actual value:</p>');
		sb.push('<p class="left">' + JSSpec.util.inspect(this.actual) + '</p>');
		sb.push('<p>should ' + (this.condition ? '' : 'not') + ' match with pattern:</p>');
		sb.push('<p class="left">' + JSSpec.util.inspect(this.pattern) + '</p>');
		sb.push('<p>but pattern matching cannot be performed.</p>');
		return sb.join("");
	} else {
		this.match = this.condition == !!this.actual.match(this.pattern);
		if(this.match) return "";
		
		sb = [];
		sb.push('<p>actual value:</p>');
		sb.push('<p class="left">' + JSSpec.util.inspect(this.actual) + '</p>');
		sb.push('<p>should ' + (this.condition ? '' : 'not') + ' match with pattern:</p>');
		sb.push('<p class="left">' + JSSpec.util.inspect(this.pattern) + '</p>');
		return sb.join("");
	}
	
};

JSSpec.PatternMatcher.prototype.matches = function(){
	return this.match;
};

JSSpec.PatternMatcher.prototype.explain = function(){
	return this.explaination;
};

/**
 * Domain Specific Languages
 */
JSSpec.DSL = {};

JSSpec.DSL.forString = {
	asHtml: function(){
		var html = this;
		
		// Uniformize quotation, turn tag names and attribute names into lower case
		html = html.replace(/<(\/?)(\w+)([^>]*?)>/img, function(str, closingMark, tagName, attrs){
			var sortedAttrs = JSSpec.util.sortHtmlAttrs(JSSpec.util.correctHtmlAttrQuotation(attrs).toLowerCase());
			return "<" + closingMark + tagName.toLowerCase() + sortedAttrs + ">";
		});
		
		// validation self-closing tags
		html = html.replace(/<br([^>]*?)>/mg, function(str, attrs){
			return "<br" + attrs + " />";
		});
		
		html = html.replace(/<hr([^>]*?)>/mg, function(str, attrs){
			return "<hr" + attrs + " />";
		});
		
		html = html.replace(/<img([^>]*?)>/mg, function(str, attrs){
			return "<img" + attrs + " />";
		});
		
		// append semi-colon at the end of style value
		html = html.replace(/style="(.*)"/mg, function(str, styleStr){
			styleStr = JSSpec.util.sortStyleEntries(styleStr.strip()); // for Safari
			if(styleStr.charAt(styleStr.length - 1) != ';') styleStr += ";";
			
			return 'style="' + styleStr + '"';
		});
		
		// sort style entries
		
		// remove empty style attributes
		html = html.replace(/ style=";"/mg, "");
		
		// remove new-lines
		html = html.replace(/\r/mg, '');
		html = html.replace(/\n/mg, '');
		
		// TODO remove this?
		//html = html.replace(/(>[^<>]*?)\s+([^<>]*?<)/mg, '$1$2')
			
		return html;
	}
};

JSSpec.DSL.describe = function(context, entries){
	JSSpec.specs.push(new JSSpec.Spec(context, entries));
};

JSSpec.DSL.expect = function(target){
	if(JSSpec._secondPass) return {};
	
	var subject = new JSSpec.DSL.Subject(target);
	return subject;
};

JSSpec.DSL.Subject = function(target){
	this.target = target;
};

JSSpec.DSL.Subject.prototype._type = 'Subject';
JSSpec.DSL.Subject.prototype.should_fail = function(message){
	JSSpec._assertionFailure = {message:message};
	throw JSSpec._assertionFailure;
};

JSSpec.DSL.Subject.prototype.should_be = function(expected){
	var matcher = JSSpec.EqualityMatcher.createInstance(expected, this.target);
	if(!matcher.matches()){
		JSSpec._assertionFailure = {message:matcher.explain()};
		throw JSSpec._assertionFailure;
	}
};

JSSpec.DSL.Subject.prototype.should_not_be = function(expected){
	// TODO JSSpec.EqualityMatcher should support 'condition'
	var matcher = JSSpec.EqualityMatcher.createInstance(expected, this.target);
	if(matcher.matches()){
		JSSpec._assertionFailure = {message:"'" + this.target + "' should not be '" + expected + "'"};
		throw JSSpec._assertionFailure;
	}
};

JSSpec.DSL.Subject.prototype.should_be_empty = function(){
	this.should_have(0, this.getType() == 'String' ? 'characters' : 'items');
};

JSSpec.DSL.Subject.prototype.should_not_be_empty = function(){
	this.should_have_at_least(1, this.getType() == 'String' ? 'characters' : 'items');
};

JSSpec.DSL.Subject.prototype.should_be_true = function(){
	this.should_be(true);
};

JSSpec.DSL.Subject.prototype.should_be_false = function(){
	this.should_be(false);
};

JSSpec.DSL.Subject.prototype.should_be_null = function(){
	this.should_be(null);
};

JSSpec.DSL.Subject.prototype.should_be_undefined = function(){
	this.should_be(undefined);
};

JSSpec.DSL.Subject.prototype.should_not_be_null = function(){
	this.should_not_be(null);
};

JSSpec.DSL.Subject.prototype.should_not_be_undefined = function(){
	this.should_not_be(undefined);
};

JSSpec.DSL.Subject.prototype._should_have = function(num, property, condition){
	var matcher = JSSpec.PropertyLengthMatcher.createInstance(num, property, this.target, condition);
	if(!matcher.matches()){
		JSSpec._assertionFailure = {message:matcher.explain()};
		throw JSSpec._assertionFailure;
	}
};

JSSpec.DSL.Subject.prototype.should_have = function(num, property){
	this._should_have(num, property, "exactly");
};

JSSpec.DSL.Subject.prototype.should_have_exactly = function(num, property){
	this._should_have(num, property, "exactly");
};

JSSpec.DSL.Subject.prototype.should_have_at_least = function(num, property){
	this._should_have(num, property, "at least");
};

JSSpec.DSL.Subject.prototype.should_have_at_most = function(num, property){
	this._should_have(num, property, "at most");
};

JSSpec.DSL.Subject.prototype.should_include = function(expected){
	var matcher = JSSpec.IncludeMatcher.createInstance(this.target, expected, true);
	if(!matcher.matches()){
		JSSpec._assertionFailure = {message:matcher.explain()};
		throw JSSpec._assertionFailure;
	}
};

JSSpec.DSL.Subject.prototype.should_not_include = function(expected){
	var matcher = JSSpec.IncludeMatcher.createInstance(this.target, expected, false);
	if(!matcher.matches()){
		JSSpec._assertionFailure = {message:matcher.explain()};
		throw JSSpec._assertionFailure;
	}
};

JSSpec.DSL.Subject.prototype.should_match = function(pattern){
	var matcher = JSSpec.PatternMatcher.createInstance(this.target, pattern, true);
	if(!matcher.matches()){
		JSSpec._assertionFailure = {message:matcher.explain()};
		throw JSSpec._assertionFailure;
	}
};

JSSpec.DSL.Subject.prototype.should_not_match = function(pattern){
	var matcher = JSSpec.PatternMatcher.createInstance(this.target, pattern, false);
	if(!matcher.matches()){
		JSSpec._assertionFailure = {message:matcher.explain()};
		throw JSSpec._assertionFailure;
	}
};

JSSpec.DSL.Subject.prototype.getType = function(){
	if(typeof this.target == 'undefined'){
		return 'undefined';
	} else if(this.target == null){
		return 'null';
	} else if(this.target._type){
		return this.target._type;
	} else if(JSSpec.util.isDomNode(this.target)){
		return 'DomNode';
	} else {
		return 'object';
	}
};

/**
 * Utilities
 */

JSSpec.util = {
	parseOptions: function(defaults){
		var options = defaults;
		
		var url = location.href;
		var queryIndex = url.indexOf('?');
		if(queryIndex == -1) return options;
		
		var query = url.substring(queryIndex + 1);
		var pairs = query.split('&');
		for(var i = 0; i < pairs.length; i++){
			var tokens = pairs[i].split('=');
			options[tokens[0]] = tokens[1];
		}
		
		return options;
	},
	correctHtmlAttrQuotation: function(html){
		html = html.replace(/(\w+)=['"]([^'"]+)['"]/mg,function (str, name, value){return name + '=' + '"' + value + '"';});
		html = html.replace(/(\w+)=([^ '"]+)/mg,function (str, name, value){return name + '=' + '"' + value + '"';});
		html = html.replace(/'/mg, '"');
		
		return html;
	},
	sortHtmlAttrs: function(html){
		var attrs = [];
		html.replace(/((\w+)="[^"]+")/mg, function(str, matched){
			attrs.push(matched);
		});
		return attrs.length == 0 ? "" : " " + attrs.sort().join(" ");
	},
	sortStyleEntries: function(styleText){
		var entries = styleText.split(/; /);
		return entries.sort().join("; ");
	},
	escapeHtml: function(str){
		if(!this._div){
			this._div = document.createElement("DIV");
			this._text = document.createTextNode('');
			this._div.appendChild(this._text);
		}
		this._text.data = str;
		return this._div.innerHTML;
	},
	isDomNode: function(o){
		// TODO: make it more stricter
		return (typeof o.nodeName == 'string') && (typeof o.nodeType == 'number');
	},
	inspectDomPath: function(o){
		var sb = [];
		while(o && o.nodeName != '#document' && o.parent){
			var siblings = o.parentNode.childNodes;
			for(var i = 0; i < siblings.length; i++){
				if(siblings[i] == o){
					sb.push(o.nodeName + (i == 0 ? '' : '[' + i + ']'));
					break;
				}
			}
			o = o.parentNode;
		}
		return sb.join(" &gt; ");
	},
	inspectDomNode: function(o){
		if(o.nodeType == 1){
			var sb = [];
			sb.push('<span class="dom_value">');
			sb.push("&lt;");
			sb.push(o.nodeName);
			
			var attrs = o.attributes;
			for(var i = 0; i < attrs.length; i++){
				if(
					attrs[i].nodeValue &&
					attrs[i].nodeName != 'contentEditable' &&
					attrs[i].nodeName != 'style' &&
					typeof attrs[i].nodeValue != 'function'
				) sb.push(' <span class="dom_attr_name">' + attrs[i].nodeName + '</span>=<span class="dom_attr_value">"' + attrs[i].nodeValue + '"</span>');
			}
			if(o.style && o.style.cssText){
				sb.push(' <span class="dom_attr_name">style</span>=<span class="dom_attr_value">"' + o.style.cssText + '"</span>');
			}
			sb.push('&gt; <span class="dom_path">(' + JSSpec.util.inspectDomPath(o) + ')</span>' );
			sb.push('</span>');
			return sb.join("");
		} else if(o.nodeType == 3){
			return '<span class="dom_value">#text ' + o.nodeValue + '</span>';
		} else {
			return '<span class="dom_value">UnknownDomNode</span>';
		}
	},
	inspect: function(o, dontEscape, emphasisKey){
		var sb, inspected;
		
		if(typeof o == 'undefined') return '<span class="undefined_value">undefined</span>';

		if(o == null) return '<span class="null_value">null</span>';
		
		if(o._type && o._type == 'String') return '<span class="string_value">"' + (dontEscape ? o : JSSpec.util.escapeHtml(o)) + '"</span>';

		if(o._type && o._type == 'Date'){
			return '<span class="date_value">"' + o.toString() + '"</span>';
		}
		
		if(o._type && o._type == 'Number') return '<span class="number_value">' + (dontEscape ? o : JSSpec.util.escapeHtml(o)) + '</span>';
		
		if(o._type && o._type == 'Boolean') return '<span class="boolean_value">' + o + '</span>';

		if(o._type && o._type == 'RegExp') return '<span class="regexp_value">' + JSSpec.util.escapeHtml(o.toString()) + '</span>';

		if(JSSpec.util.isDomNode(o)) return JSSpec.util.inspectDomNode(o);

		if(o._type && o._type == 'Array' || typeof o.length != 'undefined'){
			sb = [];
			for(var i = 0; i < o.length; i++){
				inspected = JSSpec.util.inspect(o[i]);
				sb.push(i == emphasisKey ? ('<strong>' + inspected + '</strong>') : inspected);
			}
			return '<span class="array_value">[' + sb.join(', ') + ']</span>';
		}
		
		// object
		sb = [];
		for(var key in o){
			if(key == 'should') continue;
			
			inspected = JSSpec.util.inspect(key) + ":" + JSSpec.util.inspect(o[key]);
			sb.push(key == emphasisKey ? ('<strong>' + inspected + '</strong>') : inspected);
		}
		return '<span class="object_value">{' + sb.join(', ') + '}</span>';
	}
};

var describe = JSSpec.DSL.describe;
var expect = JSSpec.DSL.expect;

var behavior_of = JSSpec.DSL.describe;
var value_of = JSSpec.DSL.expect;

String.prototype._type = "String";
Number.prototype._type = "Number";
Date.prototype._type = "Date";
Array.prototype._type = "Array";
Boolean.prototype._type = "Boolean";
RegExp.prototype._type = "RegExp";

var targets = [Array.prototype, Date.prototype, Number.prototype, String.prototype, Boolean.prototype, RegExp.prototype];

String.prototype.asHtml = JSSpec.DSL.forString.asHtml;

/**
 * Main
 */

JSSpec.defaultOptions = {
	autorun: 1,
	specIdBeginsWith: 0,
	exampleIdBeginsWith: 0,
	autocollapse: 0
};

JSSpec.options = JSSpec.util.parseOptions(JSSpec.defaultOptions);

JSSpec.Spec.id = JSSpec.options.specIdBeginsWith;
JSSpec.Example.id = JSSpec.options.exampleIdBeginsWith;



window.onload = function(){
	if(JSSpec.specs.length > 0){
		if(!JSSpec.options.inSuite){
			JSSpec.runner = new JSSpec.Runner(JSSpec.specs, new JSSpec.Logger());
			if(JSSpec.options.rerun){
				JSSpec.runner.rerun(decodeURIComponent(JSSpec.options.rerun));
			} else {
				JSSpec.runner.run();
				customFunction();
			}
		} else {
			// in suite, send all specs to parent
			var parentWindow = window.frames.parent.window;
			for(var i = 0; i < JSSpec.specs.length; i++){
				parentWindow.JSSpec.specs.push(JSSpec.specs[i]);
			}
		}
	} else {
		var links = document.getElementById('list').getElementsByTagName('A');
		var frameContainer = document.createElement('DIV');
		frameContainer.style.display = 'none';
		document.body.appendChild(frameContainer);
		
		for(var j = 0; j < links.length; j++){
			var frame = document.createElement('IFRAME');
			frame.src = links[j].href + '?inSuite=0&specIdBeginsWith=' + (j * 10000) + '&exampleIdBeginsWith=' + (j * 10000);
			frameContainer.appendChild(frame);
		}
	}
};

function customFunction(){
	var runner = document.getElementById('runner');
	runner.onclick = function(){
		JSSpec.runner.executor.run();
		runner.className = "disabled";
		runner.onclick = null;
		return false;
	};
	
	var h4s = document.getElementsByTagName('h4');
	
	function toggler(h4){
		h4.onclick = function(){
			var div = h4.parentNode.getElementsByTagName('div')[0];
			if (!div || div.parentNode.className != 'exception') return false;
			div.style.display = (div.style.display == 'block') ? 'none' : 'block';
			return false;
		};
	};
	
	for (var i = 0, l = h4s.length; i < l; i++) toggler(h4s[i]);
};