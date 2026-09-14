from django.contrib import admin
from .models import Category, SubCategory, Product, ProductImage, ProductColor, ProductFeature, Review


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1


class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ['date']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock_count', 'rating', 'review_count']
    list_filter = ['category', 'subcategory']
    search_fields = ['name', 'tagline', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductColorInline, ProductFeatureInline, ReviewInline]
    fieldsets = [
        ('Basic Info', {'fields': ['name', 'slug', 'tagline', 'description', 'category', 'subcategory']}),
        ('Pricing & Stock', {'fields': ['price', 'original_price', 'stock_count']}),
        ('Meta', {'fields': ['rating', 'review_count', 'tags', 'specs', 'shipping_info']}),
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [type('SubCategoryInline', (admin.TabularInline,), {'model': SubCategory, 'extra': 1})]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author', 'product', 'rating', 'verified', 'date']
    list_filter = ['verified', 'rating']
    list_editable = ['verified']
