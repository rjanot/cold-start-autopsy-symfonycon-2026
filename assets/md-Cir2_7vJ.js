import{t as e}from"./Slugline-DoOLJmDU.js";import{t}from"./Camera-BFR7Jnke.js";import{t as n}from"./AutopsyTable-D0W1GshI.js";import{t as r}from"./CodeExhibit-CAOEMTmc.js";import{E as i,R as a,S as o,Z as s,_ as c,_t as l,g as u,gt as d,vt as f,w as p,y as m}from"./modules/shiki-BeEIwicL.js";import{at as h,ot as g}from"./index-BX_8T27q.js";import{t as _}from"./slidev/blank-Dq8ODW62.js";var v=`if (!$input->getOption('no-optional-warmers')) {
    $this->cacheWarmer->enableOptionalWarmers();
}
$cacheDir = $kernel->getContainer()->getParameter('kernel.cache_dir');

if ($kernel instanceof WarmableInterface) {
    $kernel->warmUp($cacheDir);
}

$preload = $this->cacheWarmer->warmUp($cacheDir);`,y=`public function warmUp(string $cacheDir, ?string $buildDir = null): array
{
    if (!$buildDir) {
        return [];
    }`,b=`if ($this->container->has('cache_warmer')) {
    $cacheWarmer = $this->container->get('cache_warmer');

    if ($cacheDir !== $buildDir) {
        $cacheWarmer->enableOptionalWarmers();
    }

    $preload = array_merge($preload, $cacheWarmer->warmUp($cacheDir, $buildDir));
}`,x=p({__name:`WarmupExhibitsSet`,props:{clicks:{}},setup(e){let{$slidev:t,$nav:i,$clicksContext:c,$clicks:d,$page:f,$renderContext:p,$frontmatter:h}=g();return(t,i)=>{let c=r,d=n;return a(),m(`div`,{class:l([`exhibits-set`,{"exhibits-set--verdict":e.clicks>=4}])},[o(d,{width:5830,height:1340,wide:e.clicks===0||e.clicks>=4},{default:s(()=>[o(c,{class:`exhibits-set__exhibit`,style:{left:`140px`,top:`200px`,width:`1650px`,transform:`rotate(-2deg)`},label:`EXHIBIT A`,file:`FrameworkBundle/Command/CacheWarmupCommand.php`,version:`v7.3.0`,"first-line":63,code:v,highlight:[64,72],focused:e.clicks===1},null,8,[`focused`]),o(c,{class:`exhibits-set__exhibit`,style:{left:`1990px`,top:`340px`,width:`1700px`,transform:`rotate(1.5deg)`},label:`EXHIBIT B`,file:`FrameworkBundle/CacheWarmer/RouterCacheWarmer.php`,version:`v7.3.0`,"first-line":37,code:y,highlight:[39,40],focused:e.clicks===2},null,8,[`focused`]),o(c,{class:`exhibits-set__exhibit`,style:{left:`3890px`,top:`240px`,width:`1800px`,transform:`rotate(-1deg)`},label:`EXHIBIT C`,file:`HttpKernel/Kernel.php`,version:`v7.3.0`,"first-line":539,code:b,highlight:[542,543,544],focused:e.clicks===3},null,8,[`focused`])]),_:1},8,[`wide`]),i[0]||=u(`div`,{class:`exhibits-set__verdict`},` The warmer was there. It just never got the directory it was waiting for. `,-1)],2)}}}),S={__name:`slides.md__slidev_11`,setup(n){let{$slidev:r,$nav:l,$clicksContext:u,$clicks:p,$page:m,$renderContext:v,$frontmatter:y}=g();return u.setup(),(n,r)=>{let l=x,u=t,p=e;return a(),c(_,f(i(d(h)(d(y),10))),{default:s(()=>[o(u,{"set-width":5950,"set-height":1650,shots:[{x:2975,y:1350,zoom:.165,duration:1.2},{x:1025,y:770,zoom:.55,rotate:2,duration:2},{x:2900,y:780,zoom:.54,rotate:-1.5,duration:2.2},{x:4850,y:780,zoom:.51,rotate:1,duration:2.2},{x:2975,y:1450,zoom:.165,duration:1.8}]},{default:s(({clicks:e})=>[o(l,{clicks:e},null,8,[`clicks`])]),_:1}),o(p)]),_:1},16)}}};export{S as default};