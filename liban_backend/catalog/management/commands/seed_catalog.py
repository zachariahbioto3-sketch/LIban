from django.core.management.base import BaseCommand
from catalog.models import Category, SubCategory, Product, ProductImage, ProductColor, ProductFeature

CATEGORIES = [
    {'name': 'Electronics', 'slug': 'electronics', 'icon': 'Smartphone', 'subs': [('phones','Phones'),('laptops','Laptops'),('tablets','Tablets'),('tvs','TVs & Audio'),('cameras','Cameras'),('gaming','Gaming'),('networking','Networking'),('printers','Printers')]},
    {'name': 'Clothing', 'slug': 'clothing', 'icon': 'Shirt', 'subs': [('mens',"Men's Wear"),('womens',"Women's Wear"),('kids',"Kids' Wear"),('sportswear','Sportswear')]},
    {'name': 'Footwear', 'slug': 'footwear', 'icon': 'Footprints', 'subs': [('sneakers','Sneakers'),('formal-shoes','Formal Shoes'),('sandals','Sandals'),('boots','Boots')]},
    {'name': 'Home & Living', 'slug': 'home', 'icon': 'Home', 'subs': [('furniture','Furniture'),('kitchen','Kitchen'),('bedding','Bedding'),('lighting','Lighting')]},
    {'name': 'Accessories', 'slug': 'accessories', 'icon': 'Watch', 'subs': [('bags','Bags'),('watches','Watches'),('jewelry','Jewelry'),('sunglasses','Sunglasses')]},
    {'name': 'Kitchen', 'slug': 'kitchen', 'icon': 'ChefHat', 'subs': [('appliances','Appliances'),('cookware','Cookware'),('utensils','Utensils')]},
]

PRODUCTS = [
    {'name':'Samsung Galaxy S24 Ultra','slug':'samsung-galaxy-s24-ultra','tagline':'200MP camera, titanium build, S Pen included','description':'The ultimate Galaxy experience with pro-grade camera and all-day battery.','category':'electronics','subcategory':'phones','price':189999,'original_price':219999,'stock_count':12,'rating':4.9,'review_count':234,'tags':['New Arrival','Best Seller'],'specs':{'Display':'6.8" QHD+ AMOLED','Processor':'Snapdragon 8 Gen 3','RAM':'12GB','Storage':'256GB','Battery':'5000mAh'},'shipping_info':'Free delivery in Nairobi. 2-3 days upcountry.','images':['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'],'colors':[{'name':'Titanium Black','hex':'#1a1a1a'},{'name':'Titanium Gray','hex':'#888888'}],'features':['200MP rear camera','S Pen included','5000mAh battery','12GB RAM']},
    {'name':'iPhone 15 Pro Max','slug':'iphone-15-pro-max','tagline':'Titanium design, A17 Pro chip, 48MP camera system','description':"Apple's most powerful iPhone with titanium frame and pro camera.",'category':'electronics','subcategory':'phones','price':209999,'original_price':229999,'stock_count':8,'rating':4.8,'review_count':312,'tags':['Premium'],'specs':{'Display':'6.7" Super Retina XDR','Processor':'A17 Pro','RAM':'8GB','Storage':'256GB','Battery':'4422mAh'},'shipping_info':'Free delivery in Nairobi. 2-3 days upcountry.','images':['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'],'colors':[{'name':'Natural Titanium','hex':'#b5a99a'},{'name':'Black Titanium','hex':'#2d2d2d'}],'features':['A17 Pro chip','48MP triple camera','USB-C with USB 3','Action Button']},
    {'name':'MacBook Pro 14 M3','slug':'macbook-pro-14-m3','tagline':'M3 chip, 18hr battery, Liquid Retina XDR display','description':'Professional laptop built for power users and creatives in Kenya.','category':'electronics','subcategory':'laptops','price':279999,'original_price':319999,'stock_count':5,'rating':4.9,'review_count':156,'tags':['Top Rated'],'specs':{'Display':'14.2 Liquid Retina XDR','Processor':'Apple M3','RAM':'16GB','Storage':'512GB SSD','Battery':'18 hours'},'shipping_info':'Free delivery Nairobi CBD. Insurance included.','images':['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'],'colors':[{'name':'Space Black','hex':'#1c1c1e'},{'name':'Silver','hex':'#e8e8e8'}],'features':['M3 chip 8-core CPU','18-hour battery','14 Liquid Retina XDR','16GB unified memory']},
    {'name':'Samsung 65 QLED 4K TV','slug':'samsung-65-qled-4k-tv','tagline':'Quantum Dot technology, 4K, smart TV with Netflix built-in','description':'Transform your living room with stunning 4K QLED picture quality.','category':'electronics','subcategory':'tvs','price':129999,'original_price':159999,'stock_count':7,'rating':4.7,'review_count':89,'tags':['Best Seller'],'specs':{'Size':'65 inches','Resolution':'4K UHD','Panel':'QLED','Smart Features':'Tizen OS','Audio':'Dolby Atmos'},'shipping_info':'Free delivery and installation in Nairobi.','images':['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80'],'colors':[],'features':['4K QLED panel','Smart TV with Netflix & YouTube','120Hz refresh rate','Dolby Atmos audio']},
    {'name':'Stainless Steel Pressure Cooker 5L','slug':'stainless-steel-pressure-cooker-5l','tagline':'Cook 3x faster - gas, electric & induction compatible','description':'Heavy-duty stainless steel pressure cooker with safety valve and locking lid.','category':'kitchen','subcategory':'cookware','price':3500,'original_price':5000,'stock_count':20,'rating':4.6,'review_count':113,'tags':['Best Seller'],'specs':{'Capacity':'5 Litres','Material':'Stainless Steel','Compatibility':'Gas, Electric, Induction','Lid':'Locking Safety Lid','Weight':'1.8kg'},'shipping_info':'Free delivery in Nairobi. 2-3 days upcountry.','images':['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80'],'colors':[{'name':'Silver','hex':'#c0c0c0'}],'features':['Stainless steel body','Safety pressure release valve','Works on gas electric and induction','Ergonomic cool-touch handles','Easy-lock lid mechanism']},
    {'name':'Electric Kettle 1.8L Rapid Boil','slug':'electric-kettle-18l-rapid-boil','tagline':'Hot water in 3 minutes flat','description':'Sleek 1.8L cordless electric kettle with auto shut-off and boil-dry protection.','category':'kitchen','subcategory':'appliances','price':1800,'original_price':2500,'stock_count':35,'rating':4.5,'review_count':78,'tags':['New Arrival'],'specs':{'Capacity':'1.8 Litres','Power':'1500W','Base':'360 Swivel Cordless','Safety':'Auto Shut-Off Boil-Dry Protection','Material':'BPA-Free'},'shipping_info':'Free delivery in Nairobi. 2-3 days upcountry.','images':['https://images.unsplash.com/photo-1620483825060-84ebad6b1d31?w=600&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1571791272573-053a5be5e0c1?w=600&auto=format&fit=crop&q=80'],'colors':[{'name':'Matte Black','hex':'#1a1a1a'},{'name':'Pearl White','hex':'#f5f5f5'},{'name':'Steel Silver','hex':'#c0c0c0'}],'features':['1.8L capacity','Rapid boil under 3 minutes','Auto shut-off','Boil-dry safety protection','360 cordless swivel base','BPA-free interior']},
    {'name':'Non-Stick Frying Pan Set 3-Piece','slug':'non-stick-frying-pan-set-3-piece','tagline':'Less oil less mess more flavour','description':'Set of three non-stick frying pans with granite-coated surfaces and heat-resistant handles.','category':'kitchen','subcategory':'cookware','price':2800,'original_price':4000,'stock_count':15,'rating':4.7,'review_count':205,'tags':['Top Rated'],'specs':{'Sizes':'20cm / 24cm / 28cm','Coating':'Granite Non-Stick PFOA-Free','Handle':'Heat-Resistant Bakelite','Compatibility':'All Hob Types','Dishwasher Safe':'Yes'},'shipping_info':'Free delivery in Nairobi. 2-3 days upcountry.','images':['https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=600&auto=format&fit=crop&q=80'],'colors':[{'name':'Granite Grey','hex':'#6b6b6b'},{'name':'Rose Gold','hex':'#b76e79'}],'features':['3-piece set 20cm 24cm 28cm','Granite non-stick coating PFOA free','Heat-resistant handles','Even heat distribution','Compatible with all hob types','Dishwasher safe']},
    {'name':'Wooden Cutting Board Set 3-Piece','slug':'wooden-cutting-board-set-3-piece','tagline':'Solid acacia wood knife-friendly and beautiful','description':'Set of three acacia hardwood cutting boards in small medium and large sizes.','category':'kitchen','subcategory':'utensils','price':1500,'original_price':2200,'stock_count':25,'rating':4.8,'review_count':147,'tags':['Top Rated'],'specs':{'Material':'Acacia Hardwood','Sizes':'S / M / L','Surface':'Dual-sided Prep and Juice Groove','Care':'Hand wash recommended'},'shipping_info':'Free delivery in Nairobi. 2-3 days upcountry.','images':['https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?w=600&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80'],'colors':[{'name':'Natural Wood','hex':'#a0522d'}],'features':['100% acacia hardwood','3-piece set','Naturally antimicrobial surface','Gentle on knife edges','Juice grooves on reverse side','Doubles as a serving board']},
]


class Command(BaseCommand):
    help = 'Seed the catalog with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        ProductFeature.objects.all().delete()
        ProductColor.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        SubCategory.objects.all().delete()
        Category.objects.all().delete()

        self.stdout.write('Seeding categories...')
        cat_map = {}
        sub_map = {}
        for cat_data in CATEGORIES:
            cat = Category.objects.create(name=cat_data['name'], slug=cat_data['slug'], icon=cat_data['icon'])
            cat_map[cat_data['slug']] = cat
            for sub_slug, sub_name in cat_data['subs']:
                sub = SubCategory.objects.create(category=cat, name=sub_name, slug=sub_slug)
                sub_map[sub_slug] = sub

        self.stdout.write('Seeding products...')
        for p in PRODUCTS:
            product = Product.objects.create(
                name=p['name'], slug=p['slug'], tagline=p['tagline'], description=p['description'],
                category=cat_map.get(p['category']), subcategory=sub_map.get(p['subcategory']),
                price=p['price'], original_price=p.get('original_price'),
                stock_count=p['stock_count'], rating=p['rating'], review_count=p['review_count'],
                tags=p['tags'], specs=p['specs'], shipping_info=p['shipping_info'],
            )
            for i, url in enumerate(p['images']):
                ProductImage.objects.create(product=product, url=url, order=i)
            for c in p['colors']:
                ProductColor.objects.create(product=product, name=c['name'], hex=c['hex'])
            for i, text in enumerate(p['features']):
                ProductFeature.objects.create(product=product, text=text, order=i)

        self.stdout.write(self.style.SUCCESS(
            f'Done. {Category.objects.count()} categories, {Product.objects.count()} products seeded.'
        ))


