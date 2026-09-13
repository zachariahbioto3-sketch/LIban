from rest_framework import serializers
from .models import Category, SubCategory, Product, ProductImage, ProductColor, ProductFeature


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'subcategories']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['url', 'order']


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ['name', 'hex']


class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ['text', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    subcategory_slug = serializers.CharField(source='subcategory.slug', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'tagline',
            'category_slug', 'subcategory_slug',
            'price', 'original_price',
            'stock_count', 'rating', 'review_count',
            'tags', 'primary_image',
        ]

    def get_primary_image(self, obj):
        first = obj.images.first()
        return first.url if first else None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    subcategory = SubCategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ProductColorSerializer(many=True, read_only=True)
    features = ProductFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'tagline', 'description',
            'category', 'subcategory',
            'price', 'original_price',
            'stock_count', 'rating', 'review_count',
            'tags', 'specs', 'shipping_info',
            'images', 'colors', 'features',
            'created_at',
        ]
