from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import MyUser, Post
from .serializers import MyUserProfileSerilaizer, UserRegisterSerializer, PostSerializer, UserSerializer

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authenticated(request):
    return Response('authenticated!')

@api_view(['POST'])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):

        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            
            access_token = tokens['access']
            refresh_token = tokens['refresh']
            username = request.data['username']

            try:
                user = MyUser.objects.get(username=username)
            except MyUser.DoesNotExist:
                return Response({'error':'user does not exist'})

            res = Response()

            res.data = {"success":True,
                        "user":{
                            "username":username,
                            "bio":user.bio,
                            "email":user.email,
                            "first_name":user.first_name,
                            "last_name":user.last_name
                            }
                        }

            res.set_cookie(  #set access_token in cookie
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            
            res.set_cookie(   #set refresh_token in cookie
                key= 'refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res
        
        except Exception as e :
            return Response({'success':False, 'error':str(e)})
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            if not refresh_token:
                return Response({'success': False, 'error': 'No refresh token in cookies'})
            
            # Ensure request data is mutable
            request_data = request.data.copy()
            request_data['refresh'] = refresh_token
            request._full_data = request_data  # Override the full data for the request

            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']

            res = Response()

            res.data = {"success":True}

            res.set_cookie(  #set access_token in cookie
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )        

            return res
        
        except Exception as e:
            return Response({'success':False, "error":str(e)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile_data(request, pk):
    try:
        try:
            user = MyUser.objects.get(username=pk)
        except MyUser.DoesNotExist:
            return Response({'error':'user does not exist'})
        
        serializer = MyUserProfileSerilaizer(user, many=False)

        following = False
        if request.user in user.followers.all():
            following = True
        
        return Response({**serializer.data, 'is_our_profile': request.user.username == user.username, 'following':following})
    except:
        return Response({'error':'error getting user data'})
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggleFollow(request):
    try:
        try:
            myuser = MyUser.objects.get(username=request.user.username)  # the user that is logged in, requesting for other user's profile
            user_to_follow = MyUser.objects.get(username=request.data["username"])   # the other user whose profile is requested 
        except MyUser.DoesNotExist:
            return Response({'error':'user does not exist'})
        
        if myuser in user_to_follow.followers.all():
            user_to_follow.followers.remove(myuser)
            return Response({'now_following':False})
        else:
            user_to_follow.followers.add(myuser)
            return Response({'now_following':True})
    except Exception as e:
        return Response({'error': 'f{e}, error following user'})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_users_posts(request, pk):
    try:
        user = MyUser.objects.get(username=pk)  # the user that is logged in, requesting for other user's profile
        my_user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error':'user does not exist'})
    
    posts = user.posts.all().order_by('-created_at')

    serializer = PostSerializer(posts, many=True)

    data = []

    for post in serializer.data:
        new_post = {}
        if my_user.username in post['likes']:
            new_post = {**post, 'liked':True}
        else:
            new_post = {**post, 'liked':False}
        data.append(new_post)
    return Response(data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggleLike(request):
    try:
        try:
            post = Post.objects.get(id=request.data['id'])
        except Post.DoesNotExist:
            return Response({'error':'Post does not exist'})
        
        try:
            user = MyUser.objects.get(username=request.user.username)  # the user that is logged in, requesting for other user's profile
        except MyUser.DoesNotExist:
            return Response({'error':'user does not exist'})
        
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'now_liked':False})
        else:
            post.likes.add(user)
            return Response({'now_liked':True})
    except Exception as e:
        return Response({'error':f"failed to like the post, {e}"}) 
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        data = request.data

        try:
            user = MyUser.objects.get(username=request.user.username)
        except MyUser.DoesNotExist:
            return Response({'error':'user does not exist'})
        
        post = Post.objects.create(
            user = user,
            description = data['description']
        )

        serializer = PostSerializer(post, many=False)

        return Response(serializer.data)
    
    except Exception as e:
        return Response({'error':f"error creating post: {e}"}) 

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_posts(request):
    try:
        my_user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error':'user does not exist'})

    posts = Post.objects.all().order_by('-created_at')

    paginator = PageNumberPagination()
    paginator.page_size = 10

    result_page = paginator.paginate_queryset(posts, request)

    serializer = PostSerializer(result_page, many=True)

    #checking if logged in user has liked the post
    data =[]
    for post in serializer.data:
        new_post = {}
        if my_user.username in post['likes']:
            new_post = {**post, 'liked':True}
        else:
            new_post = {**post, 'liked':False}
        data.append(new_post)

    return paginator.get_paginated_response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.query_params.get('query', '')
    users = MyUser.objects.filter(username__icontains=query)
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['PATCH'])     #patch request to update details in database
@permission_classes([IsAuthenticated])
def update_user_details(request):
    
    data = request.data

    try:
        user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error':'user does not exist'})
    
    serializer = UserSerializer(user, data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({**serializer.data, 'success':True})
    
    return Response({**serializer.errors, 'success':False})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success':False})