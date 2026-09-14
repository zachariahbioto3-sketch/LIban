from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, ReviewSerializer
from .filters import ProductFilter


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.prefetch_related('subcategories').all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'tagline']
    ordering_fields = ['price', 'rating', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.action == 'retrieve':
            return Product.objects.prefetch_related(
                'images', 'colors', 'features', 'reviews',
                'category__subcategories', 'subcategory'
            ).all()
        return Product.objects.prefetch_related('images').select_related('category', 'subcategory').all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=True, methods=['post'], url_path='reviews', permission_classes=[AllowAny])
    def add_review(self, request, pk=None):
        product = self.get_object()
        data = {
            'author': request.data.get('author', ''),
            'rating': request.data.get('rating', 5),
            'comment': request.data.get('comment', ''),
        }
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            review = serializer.save(product=product)
            ratings = list(product.reviews.values_list('rating', flat=True))
            product.review_count = len(ratings)
            product.rating = round(sum(ratings) / len(ratings), 1) if ratings else 0
            product.save(update_fields=['review_count', 'rating'])
            return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)