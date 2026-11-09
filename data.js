// Shared sample price book + pricing for the remodel quote variants (sample numbers, not real costs)
window.GBB=(function(){
const TIERS=['Good','Better','Best'];
const SETTINGS={rate:65,markup:25,tax:7};
const BOOK={
 kitchen:{name:'Kitchen',blurb:'Cabinets, counters, floors, lighting',inputs:[
   {k:'cab',label:'Cabinet run',unit:'lin ft',v:20,min:6,max:50},
   {k:'counter',label:'Countertop area',unit:'sq ft',v:40,min:10,max:120},
   {k:'floor',label:'Floor area',unit:'sq ft',v:180,min:60,max:500},
   {k:'splash',label:'Backsplash area',unit:'sq ft',v:30,min:0,max:100}],
  items:[
   {name:'Demo & haul-off',q:null,t:[['Tear-out, dumpster, disposal',600,16],['Tear-out, dumpster, disposal',600,16],['Tear-out, dumpster, floor protection',750,18]]},
   {name:'Cabinets',q:'cab',t:[['Stock shaker, particleboard box',180,1.0],['Semi-custom plywood, soft-close',320,1.2],['Custom inset hardwood',650,1.6]]},
   {name:'Countertops',q:'counter',t:[['Laminate, square edge',30,0.3],['Quartz, eased edge',75,0.5],['Quartzite, mitered edge',120,0.6]]},
   {name:'Flooring',q:'floor',t:[['Luxury vinyl plank',3.5,0.04],['Porcelain tile',6,0.1],['Engineered white oak',11,0.08]]},
   {name:'Backsplash',q:'splash',t:[['Ceramic subway tile',5,0.25],['Glass mosaic',15,0.35],['Handmade zellige',35,0.4]]},
   {name:'Sink & faucet',q:null,t:[['Stainless drop-in, standard faucet',350,3],['Undermount, pull-down faucet',800,3],['Fireclay farmhouse, pro faucet',1800,4]]},
   {name:'Lighting',q:null,t:[['Replace existing fixtures',250,4],['4 recessed cans + undercabinet',900,10],['6 cans, undercabinet, 2 pendants',1900,14]]}]},
 bath:{name:'Bathroom',blurb:'Shower, vanity, tile, fixtures',inputs:[
   {k:'floor',label:'Floor area',unit:'sq ft',v:50,min:20,max:200},
   {k:'wall',label:'Shower wall area',unit:'sq ft',v:80,min:30,max:250},
   {k:'vanity',label:'Vanities',unit:'each',v:1,min:1,max:3}],
  items:[
   {name:'Demo & haul-off',q:null,t:[['Tear-out and disposal',400,12],['Tear-out and disposal',400,12],['Tear-out, disposal, subfloor check',500,14]]},
   {name:'Shower walls',q:'wall',t:[['Acrylic surround',8,0.15],['Ceramic tile on cement board',9,0.4],['Large-format porcelain, niche, waterproofing',18,0.55]]},
   {name:'Floor',q:'floor',t:[['Ceramic tile',4,0.2],['Porcelain tile',7,0.25],['Porcelain with heated floor',16,0.35]]},
   {name:'Vanity & top',q:'vanity',t:[['Stock vanity, cultured marble top',450,4],['Semi-custom vanity, quartz top',1200,5],['Custom vanity, stone top',2800,6]]},
   {name:'Shower valve & trim',q:null,t:[['Chrome pressure-balance',400,4],['Brushed nickel thermostatic',1100,5],['Rain head, handheld, thermostatic',2600,7]]},
   {name:'Toilet',q:null,t:[['Standard two-piece',220,1.5],['Comfort-height elongated',450,1.5],['One-piece, soft-close, skirted',950,2]]},
   {name:'Fan & lighting',q:null,t:[['Replace fan',150,2],['Quiet fan + vanity light',450,4],['Humidity-sensing fan, sconces, dimmers',900,6]]}]},
 deck:{name:'Deck',blurb:'Framing, decking, rails, stairs',inputs:[
   {k:'area',label:'Deck area',unit:'sq ft',v:300,min:80,max:1000},
   {k:'rail',label:'Railing length',unit:'lin ft',v:40,min:0,max:200},
   {k:'steps',label:'Stair treads',unit:'each',v:4,min:0,max:20}],
  items:[
   {name:'Permit & layout',q:null,t:[['Permit, layout, footings',500,10],['Permit, layout, footings',500,10],['Permit, engineered plan, footings',900,12]]},
   {name:'Framing',q:'area',t:[['Pressure-treated, 16" on center',6,0.12],['Pressure-treated, 12" on center, joist tape',7.5,0.14],['Steel framing',12,0.16]]},
   {name:'Decking',q:'area',t:[['Pressure-treated pine',3,0.06],['Composite, hidden fasteners',8,0.08],['Ipe hardwood, hidden fasteners',14,0.1]]},
   {name:'Railing',q:'rail',t:[['Wood balusters',25,0.5],['Composite rail system',55,0.6],['Aluminum cable rail',110,0.8]]},
   {name:'Stairs',q:'steps',t:[['Wood treads',120,2],['Composite treads, riser lights',200,2.5],['Ipe treads, riser lights',320,3]]}]},
 floor:{name:'Flooring',blurb:'Removal, underlayment, floor, trim',inputs:[
   {k:'area',label:'Floor area',unit:'sq ft',v:600,min:100,max:3000},
   {k:'trim',label:'Baseboard',unit:'lin ft',v:180,min:0,max:800}],
  items:[
   {name:'Remove existing',q:'area',t:[['Carpet or vinyl removal',0.3,0.03],['Carpet or vinyl removal',0.3,0.03],['Removal + floor leveling',0.9,0.05]]},
   {name:'Underlayment',q:'area',t:[['Foam underlayment',0.4,0.01],['Cork underlayment',0.8,0.01],['Moisture barrier + cork',1.5,0.015]]},
   {name:'Flooring',q:'area',t:[['Luxury vinyl plank',3,0.03],['Engineered hardwood',6,0.05],['Site-finished solid oak',9,0.09]]},
   {name:'Baseboard',q:'trim',t:[['Reinstall existing',0.2,0.04],['New MDF, painted',1.8,0.06],['New poplar, painted, shoe molding',3.2,0.08]]}]}
};
function defaults(job){const o={};BOOK[job].inputs.forEach(i=>o[i.k]=i.v);return o;}
// price of one item at one tier, including markup and tax
function itemPrice(job,ii,ti,qty){
  const it=BOOK[job].items[ii], n=it.q?(+qty[it.q]||0):1, [,m,h]=it.t[ti];
  const mk=SETTINGS.markup/100, tx=SETTINGS.tax/100, mat=m*n, lab=h*n*SETTINGS.rate;
  return {mat,lab,hrs:h*n,n,price:(mat+lab)*(1+mk)+mat*tx};
}
// picks: array of tier index per item, or a single tier number
function total(job,picks,qty){
  const items=BOOK[job].items;let sum=0,hrs=0;
  items.forEach((_,ii)=>{const r=itemPrice(job,ii,Array.isArray(picks)?picks[ii]:picks,qty);sum+=r.price;hrs+=r.hrs;});
  return {price:sum,hrs};
}
const usd=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const unitOf=(job,it)=>it.q?BOOK[job].inputs.find(i=>i.k===it.q).unit:'';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
return {TIERS,SETTINGS,BOOK,defaults,itemPrice,total,usd,unitOf,esc};
})();
