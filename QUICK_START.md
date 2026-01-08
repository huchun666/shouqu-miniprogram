# 快速开始指南

## 图标资源问题解决方案

如果遇到 `assets/icons` 路径下的图片未找到的错误，请按以下步骤解决：

### 方案1：快速生成占位图标（推荐用于开发测试）

#### 使用在线工具（最简单）

1. 访问 https://via.placeholder.com/
2. 按照以下格式生成图标：
   - TabBar图标：`https://via.placeholder.com/81x81/1a1a1a/ffffff?text=Home`
   - 功能图标：`https://via.placeholder.com/48x48/1a1a1a/ffffff?text=Icon`
3. 下载并保存到 `assets/icons/` 目录
4. 重命名为对应的文件名

#### 使用Python脚本（需要Python环境）

```bash
# 安装依赖
pip install Pillow

# 运行生成脚本（需要先创建脚本，见 assets/icons/generate-placeholders.md）
python generate_icons.py
```

### 方案2：从图标库下载（推荐用于生产环境）

1. 访问 [iconfont](https://www.iconfont.cn/) 或 [Icons8](https://icons8.com/)
2. 搜索并下载所需图标
3. 统一图标尺寸和风格
4. 保存到 `assets/icons/` 目录

### 方案3：临时使用文字图标

如果急需运行项目，可以临时修改代码，使用文字代替图标：

```xml
<!-- 原代码 -->
<image class="action-icon" src="/assets/icons/unlock.png"></image>

<!-- 临时方案 -->
<text class="action-icon-text">🔓</text>
```

### 所需图标清单

#### TabBar图标（需要普通和选中两种状态）
- home.png / home-active.png
- trip.png / trip-active.png  
- community.png / community-active.png
- profile.png / profile-active.png

#### 功能图标
- unlock.png, lock.png, start.png, stop.png
- find.png, control.png, status.png, battery.png
- settings.png, headlight.png, cruise.png, seat.png
- map.png, marker.png
- location-start.png, location-end.png
- store.png, repair.png, list.png
- vehicle.png, about.png
- avatar-default.png

### 图标规格建议

- **TabBar图标**：81px × 81px（建议提供@2x和@3x版本）
- **功能图标**：48px × 48px 或 64px × 64px
- **小图标**：32px × 32px 或 40px × 40px
- **头像**：120px × 120px
- **格式**：PNG，支持透明背景

### 快速检查

运行项目前，确保以下文件存在：

```bash
# 检查图标文件
ls -la assets/icons/

# 应该看到所有需要的图标文件
```

### 注意事项

1. 图标文件名必须与代码中引用的完全一致（区分大小写）
2. 图标路径使用绝对路径 `/assets/icons/xxx.png`
3. 建议使用统一的图标风格和颜色
4. TabBar图标建议使用2倍图和3倍图以适配不同设备

### 获取帮助

如果遇到问题：
1. 检查文件路径是否正确
2. 检查文件名是否完全匹配
3. 检查图片格式是否为PNG
4. 查看 `assets/icons/README.md` 获取详细说明
