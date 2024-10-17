import{_ as s,c as i,o as a,a1 as n}from"./chunks/framework.DCKU21so.js";const o=JSON.parse('{"title":"isinstance和type区别","description":"","frontmatter":{},"headers":[],"relativePath":"python/supplement/IsinstanceAndType.md","filePath":"python/supplement/IsinstanceAndType.md"}'),t={name:"python/supplement/IsinstanceAndType.md"},p=n(`<h1 id="isinstance和type区别" tabindex="-1">isinstance和type区别 <a class="header-anchor" href="#isinstance和type区别" aria-label="Permalink to &quot;isinstance和type区别&quot;">​</a></h1><p>在python中，我们由两种方式来判断一个类所属的类型：</p><ul><li><p><code>isinstance(x, A)</code>用来判断x是不是由类A实例化得到，或者由A的子类实例化变量得到</p></li><li><p><code>type()</code>，返回这个类的类型</p><p>通过<code>type(x) is A</code>来判断x是不是由A来创建的，与<code>isinstance</code>区别是<strong>无默认继承关系</strong></p></li></ul><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> A</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    pass</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> B</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">A</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    pass</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">b </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> B()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">isinstance</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(b, B))		</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># True</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">isinstance</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(b, A))		</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># True</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(b))				</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># &lt;class &#39;__main__.B&#39;&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(b) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">is</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> B)			</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># True</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(b) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">is</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> A)			</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># False</span></span></code></pre></div><p>所以建议使用<code>isinstance</code>而不是<code>type</code>来判断类型</p>`,5),e=[p];function l(h,k,d,r,c,E){return a(),i("div",null,e)}const g=s(t,[["render",l]]);export{o as __pageData,g as default};
