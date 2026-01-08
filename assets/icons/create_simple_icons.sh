#!/bin/bash
# 使用sips创建简单图标（macOS自带工具）

cd "$(dirname "$0")"

echo "开始创建图标..."

# 创建一个1x1的临时PNG文件作为基础
temp_base="/tmp/icon_base.png"

# 使用sips创建纯色图片
create_icon() {
    local name=$1
    local size=$2
    local color=$3
    
    # 使用sips创建纯色图片
    # 注意：sips的颜色格式是RGB，需要转换十六进制
    case $color in
        "#1a1a1a")
            rgb="26 26 26"
            ;;
        "#07c160")
            rgb="7 193 96"
            ;;
        "#fa5151")
            rgb="250 81 81"
            ;;
        "#ff9500")
            rgb="255 149 0"
            ;;
        "#e5e5e5")
            rgb="229 229 229"
            ;;
        *)
            rgb="26 26 26"
            ;;
    esac
    
    # 创建纯色图片
    sips -z $size $size --setProperty format png --padToHeightWidth $size $size --padColor "$rgb" /System/Library/CoreServices/DefaultDesktop.heic "$name.png" 2>/dev/null || {
        # 如果sips失败，使用Python创建（如果可用）
        python3 << EOF
from PIL import Image
img = Image.new('RGB', ($size, $size), tuple(map(int, '$rgb'.split())))
img.save('$name.png', 'PNG')
print('Created: $name.png')
EOF
    }
}

# TabBar图标
create_icon "home" 81 "#1a1a1a"
create_icon "home-active" 81 "#07c160"
create_icon "trip" 81 "#1a1a1a"
create_icon "trip-active" 81 "#07c160"
create_icon "community" 81 "#1a1a1a"
create_icon "community-active" 81 "#07c160"
create_icon "profile" 81 "#1a1a1a"
create_icon "profile-active" 81 "#07c160"

# 功能图标
create_icon "unlock" 48 "#07c160"
create_icon "lock" 48 "#fa5151"
create_icon "start" 48 "#1a1a1a"
create_icon "stop" 48 "#ff9500"
create_icon "find" 48 "#1a1a1a"
create_icon "control" 48 "#1a1a1a"
create_icon "status" 48 "#1a1a1a"
create_icon "battery" 48 "#1a1a1a"
create_icon "settings" 48 "#1a1a1a"
create_icon "headlight" 48 "#1a1a1a"
create_icon "cruise" 48 "#1a1a1a"
create_icon "seat" 48 "#1a1a1a"
create_icon "map" 48 "#1a1a1a"
create_icon "marker" 40 "#fa5151"
create_icon "location-start" 32 "#07c160"
create_icon "location-end" 32 "#fa5151"
create_icon "store" 48 "#1a1a1a"
create_icon "repair" 48 "#1a1a1a"
create_icon "list" 48 "#1a1a1a"
create_icon "vehicle" 48 "#1a1a1a"
create_icon "about" 48 "#1a1a1a"
create_icon "avatar-default" 120 "#e5e5e5"

echo "完成！"
ls -1 *.png 2>/dev/null | wc -l | xargs echo "共创建图标文件:"
