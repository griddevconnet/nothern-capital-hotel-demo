from django.urls import include, path, re_path

urlpatterns = [
    path('auth/', include('accounts.urls')),
    re_path(r'^rooms/?', include('rooms.urls')),
    path('bookings/', include('bookings.urls')),
    path('admin/', include('backend.admin_urls')),
]
