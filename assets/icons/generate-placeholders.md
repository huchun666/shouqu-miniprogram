# 快速生成占位图标

由于无法直接创建图片文件，这里提供几种快速生成占位图标的方法：

## 方法1：使用在线工具（最简单）

访问以下网站，快速生成占位图标：

1. **Placeholder.com**: https://via.placeholder.com/81x81/1a1a1a/ffffff?text=Home
   - 将尺寸改为需要的尺寸（如 81x81）
   - 将颜色改为需要的颜色
   - 将文字改为图标名称

2. **DummyImage**: https://dummyimage.com/81x81/1a1a1a/ffffff&text=Home

## 方法2：使用Python脚本生成（需要Python环境）

创建 `generate_icons.py` 文件：

```python
from PIL import Image, ImageDraw, ImageFont
import os

# 创建输出目录
os.makedirs('assets/icons', exist_ok=True)

# 图标配置
icons = [
    ('home', 81, '#1a1a1a'),
    ('home-active', 81, '#1a1a1a'),
    ('trip', 81, '#1a1a1a'),
    ('trip-active', 81, '#1a1a1a'),
    ('community', 81, '#1a1a1a'),
    ('community-active', 81, '#1a1a1a'),
    ('profile', 81, '#1a1a1a'),
    ('profile-active', 81, '#1a1a1a'),
    ('unlock', 48, '#1a1a1a'),
    ('lock', 48, '#1a1a1a'),
    ('start', 48, '#1a1a1a'),
    ('stop', 48, '#1a1a1a'),
    ('find', 48, '#1a1a1a'),
    ('control', 48, '#1a1a1a'),
    ('status', 48, '#1a1a1a'),
    ('battery', 48, '#1a1a1a'),
    ('settings', 48, '#1a1a1a'),
    ('headlight', 48, '#1a1a1a'),
    ('cruise', 48, '#1a1a1a'),
    ('seat', 48, '#1a1a1a'),
    ('map', 48, '#1a1a1a'),
    ('marker', 40, '#fa5151'),
    ('location-start', 32, '#07c160'),
    ('location-end', 32, '#fa5151'),
    ('store', 48, '#1a1a1a'),
    ('repair', 48, '#1a1a1a'),
    ('list', 48, '#1a1a1a'),
    ('vehicle', 48, '#1a1a1a'),
    ('about', 48, '#1a1a1a'),
    ('avatar-default', 120, '#e5e5e5'),
]

for name, size, color in icons:
    # 创建图片
    img = Image.new('RGB', (size, size), color)
    draw = ImageDraw.Draw(img)
    
    # 添加文字（可选）
    try:
        font = ImageFont.truetype("arial.ttf", size // 3)
        text = name[:4].upper()
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        position = ((size - text_width) // 2, (size - text_height) // 2)
        draw.text(position, text, fill='white', font=font)
    except:
        pass
    
    # 保存
    img.save(f'assets/icons/{name}.png')
    print(f'Generated: {name}.png')

print('All icons generated!')
```

运行：
```bash
pip install Pillow
python generate_icons.py
```

## 方法3：手动创建简单图标

1. 使用任何图片编辑软件（如Photoshop、GIMP、甚至画图工具）
2. 创建指定尺寸的图片
3. 填充纯色或添加简单图形
4. 保存为PNG格式

## 方法4：从图标库下载（推荐用于生产环境）

1. **iconfont（阿里巴巴图标库）**: https://www.iconfont.cn/
   - 搜索需要的图标
   - 下载PNG格式
   - 统一尺寸和风格

2. **Icons8**: https://icons8.com/
   - 提供免费图标
   - 可下载PNG格式

3. **Flaticon**: https://www.flaticon.com/
   - 大量免费图标
   - 支持PNG下载

## 临时解决方案

如果急需运行项目，可以：

1. 使用纯色方块作为占位符
2. 使用文字图标（修改代码使用文字代替图片）
3. 使用小程序内置的图标字体

## 图标尺寸参考

- TabBar图标：81px × 81px（@1x），162px × 162px（@2x），243px × 243px（@3x）
- 功能图标：48px × 48px 或 64px × 64px
- 小图标：32px × 32px 或 40px × 40px
- 头像：120px × 120px
