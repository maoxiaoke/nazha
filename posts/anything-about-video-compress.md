---
title: H.264 视频压缩策略
published: false
listed: true
date: '12/15/2024'
lastUpdateDate: '12/15/2024'
tags: tech
language: Chinese
aiProportion: 0
---

还记得早前在 X 上爆火一个有关视频压缩的[帖子](https://x.com/mortenjust/status/1817991110544744764)，其背后发挥神奇的命令是：

```shell
ffmpeg -i "input.mp4" -c:v libx264 -tag:v avc1 -movflags faststart -crf 30 -preset superfast "output.mp4
```

恰逢最近在研究类似的事情，所以深入研究了一下。通过这篇文章，你会了解 H.264 压缩的一些基本概念，最后，文章开创性地提出 **VFS Score** 公式来客观地选择合适 crf 取值，来妥协视频质量和尺寸之间的关系。

## 视频相关参数

视频是一种通过连续播放静止图像（称为**帧**）来呈现动态视觉内容的媒介。通常，视频包含**图像、声音**（如对话、背景音乐、音效等）以及可能的文**字说明或字幕**等元素。

### 编码

- H.264/H.265 （.mp4）
    
    - **H.264 兼容性非常高，提供的压缩率一般。**
        
    - H.265 压缩效率很高，但是兼容性一般
        
- VP9 (.webm)
    
    - 能够提供接近或优于 H.265 的质量
        
    - Safari 的支持度不好 https://en.wikipedia.org/wiki/WebM
        
- AV1(.mp4/.webm)
    
    - VP9 的下一代，压缩效率非常高，质量也保持得比较好
        
    - 支持度比较差
        
- Theora(.ogg)
    
- Windows Media Video (.wmv)

### 码率

视频文件每秒钟传输的数据量，单位是 bps (bit per second）。视频总大小约等于码率`*`时长。可以说**码率是影响视频播放流畅度最重要因素。** 码率越小，视频清晰度越低，还原度越差。码率高到一定程度之后，也无法继续提升视频清晰度。

### 帧率

**帧率**（Frame Rate）是指视频每秒显示的静态画面（帧）的数量，单位为 **fps**（frames per second，帧每秒）。帧率直接影响视频的流畅度和观感。

### 分辨率

衡量视频图像清晰度，表示视频画面的像素数量。分辨率由宽度和高度的像素数表示，例如 **1920x1080。分辨率越高，画质越清晰，分辨率越高，文件越大。**

### 视频大小计算公式

视频大小 = （音频码率 + 视频码率） `*` 时长 / 8
未压缩的音频码率计算：采样率 `*` 采样位数 `*` 通道数
未压缩的视频码率：帧率 `*` 分辨率 `*` 位深度

**压缩视频码率由编码器的目标码率设定**。

## Rate Control

既然压缩视频的码率是由编码器的目标码率设定的，而 Rate Control 指的是视频编码器决定每一个帧包含多少个 bits 所做的事情。Rate Control 是确定大小和质量的一个关键步骤。

H.264 Rate Control 常见模式有：

1. COP: Constant Quantization Parameter

The _Quantization Parameter_ controls the amount of compression for every macroblock in a frame。这种方式的编码效率低，也浪费空间。 通过将相同类型的每个帧压缩相同的量来实现恒定的质量，即丢弃相同（相对）量的信息。用技术术语来说，就是保持恒定的 QP（量化参数）。量化参数定义从给定像素块（宏块）中丢弃多少信息

```Shell
ffmpeg -i <input> -c:v libx264 -qp 23 <output>
```

2. ABR: Average Bitrate 平均比特率，也叫目标比特率
由于编码器不知道具体的时间会达到这个比特率，因此它必须猜测如何达到该比特率，可能导致短片段内出现巨大的质量变化。

```Shell
ffmpeg -i <input> -c:v libx264 -b:v 1M <output>
```

3. CBR：Constant Bitrate 恒定比特率

它确保比特率在整个流中保持恒定。

```Shell
ffmpeg -i <input> -c:v libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v 1M -minrate 1M -maxrate 1M -bufsize 2M <output>
```

4. 2-Pass ABR： 2-Pass Average Bitrate

允许编码器执行两次（或更多次）使其能够及时估计前方的情况，它可以计算在第一遍中对帧进行编码的成本，然后在第二遍中更有效地使用可用的比特。这保证了在一定码率约束下输出质量是最好的。

```Shell
ffmpeg -i <input> -c:v libx264 -b:v 1M -pass 2 <output>.mp4
```

5. **CRF：Constant Rate Factor**

CRF 是一种基于质量的 Rate Control 控制模式，和 COQ 的不同是，它以不同的量压缩不同的帧（在物体移动的时候丢弃更多的细节），在物体静止的时候保留更多的细节。

```Shell
ffmpeg -i <input> -c:v libx264 -crf 23 <output>
```

6. VBV：Constrained Encoding

VBV 提供了一种确保比特率限制在某个最大值的方法，可以确定在特定时间范围内发送的比特数不会超过您承诺的比特数。VBV 可以与 2 通道 VBR（在两次通道中使用）一起使用，也可以与 CRF 编码一起使用。

```Shell
ffmpeg -i <input> -c:v libx264 -crf 23 -maxrate 1M -bufsize 2M <output>
```

关于 Rate Control 的更多细节，推荐大家阅读这篇内容 - [Understanding Rate Control Modes](https://slhck.info/video/2017/03/01/rate-control.html)。

## 让我们回看开头的指令

```shell
ffmpeg -i "input.mp4" -c:v libx264 -tag:v avc1 -movflags faststart -crf 30 -preset superfast "output.mp4
```

- `-i input.mp4` 指定输入文件
- `-c:v libx264` 设置视频编码为 H.264 编码器（**支持度最好**）
- `-tag:v avc1` 视频编码器标记（tag）为 **avc1，**保证 safari 的兼容性
- `-movflags faststart` 把元数据 moov atom 放在文件开头，而不是末尾
- `-crf 30` 设置 CRF 参数为 30
- `-preset superfast` 提高编码效率，牺牲部分压缩效率

关于 **元数据 moov atom 放在文件开头，而不是末尾**，是每个前端同学在视频请求优化，会遇到的[不必要的三次请求问题](https://www.zhangxinxu.com/wordpress/2018/12/video-moov-box/)。

接下来的问题是，为什么 `-crf` 的取值应该是多少？目前我们知道的是，`-crf` 的值越低（越靠近 18），质量越好，但是视频的尺寸越大。越靠近 52，质量越差，但视频的尺寸最小。

为了客观地妥协质量和尺寸的关系，找到一个公式最优，我引入了一个叫 **VFS Score** 的公式。

## VFS Score

为了客观地评估视频的质量（而非用肉眼方式），我们使用 Netflix 的 **[VMAF 视频评估方法](https://github.com/Netflix/vmaf?tab=readme-ov-file)**，这是一种基于机器学习的视频质量评估方法，它通过分析视频序列的多个质量特征来预测观众的主观质量感受。VMAF得分范围从0到100，其中100表示最高质量。

根据质量 VMAF 评分 `V` 和视频尺寸 `S`，得到归一化公式：

$$
VFS = w_v \cdot \frac{\text{VMAF} - V_{\text{min}}}{V_{\text{max}} - V_{\text{min}}} + w_s \cdot \left(1 - \frac{\text{S} - S_{\text{min}}}{S_{\text{max}} - S_{\text{min}}}\right)
$$

其中：

- `w_v` ：VMAF 的权重，表示对视频质量的重视程度
- `w_s` ：文件大小的权重，表示对文件尺寸的重视程度

`w_v` + `w_s` = 1 ：保证权重总和为 1。根据不同的业务场景，可以动态调整 `w_v` 和 `w_s` 的值，以达到最优的结果。

## 结果

对于给定视频，设定 `w_v=0.5; w_s=0.5` VMAF 的跑分脚本如下：

```Shell
# First convert input file to Y4M format
input_mp4="input.mp4"
input_y4m="input.y4m"
echo "Converting input file to Y4M format..."
ffmpeg -i "$input_mp4" -pix_fmt yuv420p -f yuv4mpegpipe "$input_y4m"

# Initialize arrays to store results
declare -a sizes
declare -a vmaf_scores

# Function to convert file size to MB
convert_to_mb() {
    local size=$1
    local number=$(echo $size | sed 's/[^0-9.]//g')
    local unit=$(echo $size | sed 's/[0-9.]//g')
    
    case $unit in
        "K"|"KB")
            echo "scale=2; $number / 1024" | bc
            ;;
        "M"|"MB")
            echo $number
            ;;
        "G"|"GB")
            echo "scale=2; $number * 1024" | bc
            ;;
        *)
            echo "scale=2; $number / 1048576" | bc  # Convert bytes to MB
            ;;
    esac
}

# Loop through CRF values from 18 to 51
for crf in {18..51}; do
    output_mp4="output.mp4"
    output_y4m="output.y4m"
    output_json="output-vmaf.json"
    echo "Processing CRF = $crf"
    
    # Encode with x264
    ffmpeg -i "$input_mp4" -c:v libx264 -tag:v avc1 -movflags faststart -crf $crf -preset superfast "$output_mp4"
    
    # Convert encoded file to Y4M
    ffmpeg -i "$output_mp4" -pix_fmt yuv420p -f yuv4mpegpipe "$output_y4m"
    
    # Calculate VMAF and store result in JSON
    vmaf -r "$input_y4m" -d "$output_y4m" -o "$output_json" --json
    
    # Extract VMAF score from JSON using jq
    vmaf_score=$(jq '.frames | map(.metrics.vmaf) | add / length' "$output_json")
    vmaf_scores[$crf]=$vmaf_score
    
    # Get and store file size in MB
    raw_size=$(ls -lh "$output_mp4" | awk '{print $5}')
    size_mb=$(convert_to_mb "$raw_size")
    sizes[$crf]=$size_mb
    
    # Clean up Y4M and JSON files to save space
    rm "$output_y4m" "$output_json"
done

# Clean up input Y4M file
rm "$input_y4m"

# Print all results in a table format
echo "----------------------------------------"
echo "Results Summary:"
echo "----------------------------------------"
echo "CRF | Size (MB) | VMAF Score"
echo "----------------------------------------"
for crf in {18..51}; do
    printf "%3d | %8.2f | %10.2f\n" "$crf" "${sizes[$crf]}" "${vmaf_scores[$crf]}"
done
echo "----------------------------------------"
```

根据归一化公式计算出来的 VFS Score：

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|CRF|Size|VMAF|V|S|VFS Score|
|18|12|96.01|0.9601|1|0.48005|
|19|11|95.65|0.9565|0.922818792|0.516840604|
|20|8.8|95.26|0.9526|0.738255034|0.607172483|
|21|7.4|94.79|0.9479|0.620805369|0.663547315|
|22|6.1|94.26|0.9426|0.511744966|0.715427517|
|23|5|93.67|0.9367|0.419463087|0.758618456|
|24|4.1|92.94|0.9294|0.343959732|0.792720134|
|25|3.4|92.15|0.9215|0.285234899|0.81813255|
|26|2.8|91.22|0.9122|0.234899329|0.838650336|
|27|2.3|90.22|0.9022|0.19295302|0.85462349|
|28|1.8|89.03|0.8903|0.151006711|0.869646644|
|29|1.4|87.69|0.8769|0.117449664|0.879725168|
|30|1.1|86.31|0.8631|0.092281879|0.88540906|
|31|0.92|84.57|0.8457|0.077181208|0.884259396|
|32|0.76|82.69|0.8269|0.063758389|0.881570805|
|33|0.62|80.6|0.806|0.052013423|0.876993289|
|34|0.51|78.3|0.783|0.042785235|0.870107383|
|35|0.43|75.7|0.757|0.036073826|0.860463087|
|36|0.36|72.78|0.7278|0.030201342|0.848799329|
|37|0.31|69.71|0.6971|0.026006711|0.835546644|
|38|0.27|66.31|0.6631|0.022651007|0.820224497|
|39|0.24|62.55|0.6255|0.020134228|0.802682886|
|40|0.21|58.53|0.5853|0.01761745|0.783841275|
|41|0.18|54.18|0.5418|0.015100671|0.763349664|
|42|0.16|49.61|0.4961|0.013422819|0.741338591|
|43|0.14|45.09|0.4509|0.011744966|0.719577517|
|44|0.13|40.16|0.4016|0.01090604|0.69534698|
|45|0.12|35.46|0.3546|0.010067114|0.672266443|
|46|0.11|30.71|0.3071|0.009228188|0.648935906|
|47|0.1|26.69|0.2669|0.008389262|0.629255369|
|48|0.09|22.88|0.2288|0.007550336|0.610624832|
|49|0.09|19.85|0.1985|0.007550336|0.595474832|
|50|0.08|17.36|0.1736|0.006711409|0.583444295|
|51|0.08|15.17|0.1517|0.006711409|0.572494295|

可见，得分最高的是 `-crf=30`。同样，调整 `w_v` 和 `w_s` 的值，可以得到其他最优的值。