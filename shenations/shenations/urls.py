
from django.contrib import admin
from django.urls import include, path


from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('admin/', admin.site.urls),   
    path('api/auth/', include('accounts.urls')), 
    path('api/courses/', include('courses.urls')),
    path('api/applications/', include('applications.urls')),
]
