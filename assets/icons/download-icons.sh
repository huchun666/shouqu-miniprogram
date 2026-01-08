#!/bin/bash
# 图标批量下载脚本

echo "开始下载图标..."

# TabBar图标
echo "下载TabBar图标..."
curl -s -o home.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=HOME"
curl -s -o home-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=HOME"
curl -s -o trip.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=TRIP"
curl -s -o trip-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=TRIP"
curl -s -o community.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=COMM"
curl -s -o community-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=COMM"
curl -s -o profile.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=USER"
curl -s -o profile-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=USER"

# 功能图标
echo "下载功能图标..."
curl -s -o unlock.png "https://via.placeholder.com/48x48/07c160/ffffff?text=UN"
curl -s -o lock.png "https://via.placeholder.com/48x48/fa5151/ffffff?text=LO"
curl -s -o start.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=ST"
curl -s -o stop.png "https://via.placeholder.com/48x48/ff9500/ffffff?text=SP"
curl -s -o find.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=FI"
curl -s -o control.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=CT"
curl -s -o status.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=ST"
curl -s -o battery.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=BA"
curl -s -o settings.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=SE"
curl -s -o headlight.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=HL"
curl -s -o cruise.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=CR"
curl -s -o seat.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=SE"
curl -s -o map.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=MA"
curl -s -o marker.png "https://via.placeholder.com/40x40/fa5151/ffffff?text=MK"
curl -s -o location-start.png "https://via.placeholder.com/32x32/07c160/ffffff?text=ST"
curl -s -o location-end.png "https://via.placeholder.com/32x32/fa5151/ffffff?text=EN"
curl -s -o store.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=ST"
curl -s -o repair.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=RE"
curl -s -o list.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=LI"
curl -s -o vehicle.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=VE"
curl -s -o about.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=AB"
curl -s -o avatar-default.png "https://via.placeholder.com/120x120/e5e5e5/999999?text=AV"

echo "下载完成！"
echo "已下载的图标文件："
ls -1 *.png | wc -l
echo "个图标文件"
