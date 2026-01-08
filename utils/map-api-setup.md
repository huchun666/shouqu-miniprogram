# 地图API集成指南

## 腾讯地图API集成

### 1. 申请Key

1. 访问 [腾讯位置服务控制台](https://lbs.qq.com/)
2. 注册/登录账号
3. 创建应用，获取Key
4. 配置小程序域名白名单

### 2. 安装SDK（方式1：使用SDK）

#### 下载SDK
- 下载地址：https://mapapi.qq.com/web/miniprogram/QQMapWX-JSSDK.zip
- 解压后将 `qqmap-wx-jssdk.js` 放到项目 `libs/` 目录

#### 使用示例
```javascript
// 在 utils/navigation.js 中引入
import QQMapWX from '../libs/qqmap-wx-jssdk';

const qqmapsdk = new QQMapWX({
  key: 'YOUR_KEY'
});

// 调用路线规划
qqmapsdk.direction({
  mode: 'driving',
  from: '39.9042,116.4074',
  to: '39.9142,116.4174',
  success: (res) => {
    console.log(res);
  }
});
```

### 3. 直接调用API（方式2：HTTP请求）

#### 路线规划接口
```
GET https://apis.map.qq.com/ws/direction/v1/driving/
```

#### 请求参数
- `key`: 腾讯地图Key
- `from`: 起点坐标 `纬度,经度`
- `to`: 终点坐标 `纬度,经度`
- `output`: 返回格式，默认 `json`

#### 响应示例
```json
{
  "status": 0,
  "message": "query ok",
  "result": {
    "routes": [{
      "distance": 5000,
      "duration": 300,
      "steps": [
        {
          "instruction": "从起点出发",
          "road_name": "xxx路",
          "distance": 100,
          "act_desc": "直行",
          "start_location": {
            "lat": 39.9042,
            "lng": 116.4074
          }
        }
      ],
      "polyline": "xxx" // 路线坐标串
    }]
  }
}
```

## 高德地图API集成（备选）

### 1. 申请Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册/登录账号
3. 创建应用，获取Key

### 2. 路线规划接口

```
GET https://restapi.amap.com/v3/direction/driving
```

#### 请求参数
- `key`: 高德地图Key
- `origin`: 起点 `经度,纬度`（注意顺序）
- `destination`: 终点 `经度,纬度`
- `extensions`: 返回信息详细程度，`base` 或 `all`

#### 响应示例
```json
{
  "status": "1",
  "info": "OK",
  "route": {
    "paths": [{
      "distance": 5000,
      "duration": 300,
      "steps": [
        {
          "instruction": "从起点出发",
          "road": "xxx路",
          "distance": 100,
          "action": "直行",
          "polyline": "116.4074,39.9042;116.4174,39.9142"
        }
      ],
      "polyline": "xxx"
    }]
  }
}
```

## 配置小程序域名

在微信公众平台配置：

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 开发 -> 开发管理 -> 开发设置
3. 服务器域名 -> request合法域名
4. 添加：
   - `https://apis.map.qq.com`
   - `https://restapi.amap.com`

## 使用建议

1. **开发环境**：使用模拟数据，避免消耗API配额
2. **测试环境**：使用真实API，测试功能
3. **生产环境**：使用真实API，添加错误处理和降级方案

## 错误处理

建议添加完善的错误处理：

```javascript
try {
  const route = await planRoute(start, end);
  // 使用路线数据
} catch (error) {
  // 降级到模拟数据
  const mockRoute = getMockRoute(start, end);
  // 或提示用户
  showToast('路线规划失败，请重试');
}
```

## 费用说明

- 腾讯地图：有免费配额，超出后按量计费
- 高德地图：有免费配额，超出后按量计费
- 建议：合理使用缓存，避免重复请求
