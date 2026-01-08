#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快速生成占位图标
需要安装Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("请先安装Pillow: pip install Pillow")
    exit(1)

# 确保输出目录存在
output_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(output_dir)

# 图标配置
icons = [
    # TabBar图标 (81x81)
    ('home', 81, '#1a1a1a', 'HOME'),
    ('home-active', 81, '#07c160', 'HOME'),
    ('trip', 81, '#1a1a1a', 'TRIP'),
    ('trip-active', 81, '#07c160', 'TRIP'),
    ('community', 81, '#1a1a1a', 'COMM'),
    ('community-active', 81, '#07c160', 'COMM'),
    ('profile', 81, '#1a1a1a', 'USER'),
    ('profile-active', 81, '#07c160', 'USER'),
    
    # 功能图标 (48x48)
    ('unlock', 48, '#07c160', 'UN'),
    ('lock', 48, '#fa5151', 'LO'),
    ('start', 48, '#1a1a1a', 'ST'),
    ('stop', 48, '#ff9500', 'SP'),
    ('find', 48, '#1a1a1a', 'FI'),
    ('control', 48, '#1a1a1a', 'CT'),
    ('status', 48, '#1a1a1a', 'ST'),
    ('battery', 48, '#1a1a1a', 'BA'),
    ('settings', 48, '#1a1a1a', 'SE'),
    ('headlight', 48, '#1a1a1a', 'HL'),
    ('cruise', 48, '#1a1a1a', 'CR'),
    ('seat', 48, '#1a1a1a', 'SE'),
    ('map', 48, '#1a1a1a', 'MA'),
    ('store', 48, '#1a1a1a', 'ST'),
    ('repair', 48, '#1a1a1a', 'RE'),
    ('list', 48, '#1a1a1a', 'LI'),
    ('vehicle', 48, '#1a1a1a', 'VE'),
    ('about', 48, '#1a1a1a', 'AB'),
    
    # 小图标
    ('marker', 40, '#fa5151', 'MK'),
    ('location-start', 32, '#07c160', 'ST'),
    ('location-end', 32, '#fa5151', 'EN'),
    
    # 头像
    ('avatar-default', 120, '#e5e5e5', 'AV'),
]

def hex_to_rgb(hex_color):
    """将十六进制颜色转换为RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_icon(name, size, color, text):
    """创建图标"""
    # 创建图片
    img = Image.new('RGB', (size, size), hex_to_rgb(color))
    draw = ImageDraw.Draw(img)
    
    # 添加文字
    try:
        # 尝试使用系统字体
        font_size = max(size // 3, 12)
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
            except:
                font = ImageFont.load_default()
        
        # 计算文字位置（居中）
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        position = ((size - text_width) // 2, (size - text_height) // 2)
        
        # 绘制文字（白色）
        draw.text(position, text, fill='white', font=font)
    except Exception as e:
        print("警告: 无法添加文字到 {}: {}".format(name, e))
    
    # 保存
    filename = f'{name}.png'
    img.save(filename, 'PNG')
    print(f'✓ 生成: {filename} ({size}x{size})')

def main():
    print("开始生成图标...")
    print(f"输出目录: {output_dir}\n")
    
    for name, size, color, text in icons:
        create_icon(name, size, color, text)
    
    print("\n完成! 共生成 {} 个图标文件".format(len(icons)))
    print("文件保存在: {}".format(output_dir))

if __name__ == '__main__':
    main()
