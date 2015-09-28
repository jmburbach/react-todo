from django.conf.urls import url, include
from django.views.generic.base import TemplateView

from rest_framework import routers

from . import views
import item.views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'items', item.views.ItemViewSet)

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/',
        include('rest_framework.urls',
        namespace='rest_framework')
    )
]
