from rest_framework.response import Response
from rest_framework.views import APIView
from feedback.models import Review , Question
from users.models import User
from feedback.serializer import GetReviewSerilizer ,PostReviewSerilizer,QuestionSerilizer
from rest_framework import status
from users.errorrRenderers import UserRenderer
from django.contrib.auth import authenticate
from product.models import Product
# Create your views here.

class ReviewView(APIView):
    renderer_classes = [UserRenderer]
 
    def post(self, request, format=None):
      # Intentar obtener el usuario por email si está registrado
      user = None
      email = request.data.get('email')
      
      if email:
        try:
          user = User.objects.get(email=email)
        except User.DoesNotExist:
          user = None
      
      product = Product.objects.get(pk=request.data.get('product'))

      serializer = PostReviewSerilizer(data=request.data)
      if serializer.is_valid(raise_exception=ValueError):
        review = Review.objects.create(
          rating=serializer.validated_data['rating'],
          content=serializer.validated_data['content'],
          author_name=serializer.validated_data.get('author_name'),
          author_email=serializer.validated_data.get('author_email'),
          customer=user,
          productReviewed=product
        )
        serilzer = GetReviewSerilizer(review)
        return Response(serilzer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        
    def get(self, request, format=None):
        review = Review.objects.all()
        serializer = GetReviewSerilizer(review, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    def delete(self, request, pk, format=None):
       review = Review.objects.get(id=pk)
       review.delete()
       return Response(status=status.HTTP_202_ACCEPTED)


class ProductReviewView(APIView):
    renderer_classes = [UserRenderer]
    
    def get(self, request, pk, format=None):
        """Get all reviews for a specific product"""
        reviews = Review.objects.filter(productReviewed=pk)
        serializer = GetReviewSerilizer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QusetionView(APIView):
    renderer_classes = [UserRenderer]
    def get(self, request, format=None):
        qusetion = Question.objects.all()
        serializer = QuestionSerilizer(qusetion, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
      serializer = QuestionSerilizer(data=request.data)
      if serializer.is_valid(raise_exception=ValueError):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 