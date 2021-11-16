from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework import status, views, permissions
from rest_framework.response import Response
from .serializers import UserSerializer


class AdminLoginView(views.APIView):
    @method_decorator(csrf_protect)
    def post(self, request):
        user = authenticate(username=request.data.get("username"), password=request.data.get("password"))

        if user is None or not user.is_active:
            return Response(
                {"status": "Unauthorized", "message": "Username or Password is Incorrect"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_staff:
            return Response(
                {"status": "Unauthorized", "message": "Unauthorized Access"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        login(request, user)
        return Response(UserSerializer(user).data)


class MemberLoginView(views.APIView):
    @method_decorator(csrf_protect)
    def post(self, request):
        user = authenticate(username=request.data.get("username"), password=request.data.get("password"))

        if user is None or not user.is_active:
            return Response(
                {"status": "Unauthorized", "message": "Username or Password is Incorrect"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        login(request, user)
        return Response(UserSerializer(user).data)


class LogoutView(views.APIView):
    def get(self, request):
        logout(request)
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class WhoAmIView(views.APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.id:
            return Response(
                data={"response_id": status.HTTP_202_ACCEPTED},
                status=status.HTTP_202_ACCEPTED,
            )
        else:
            return Response(
                data={"response_id": status.HTTP_401_UNAUTHORIZED}, status=status.HTTP_401_UNAUTHORIZED
            )
