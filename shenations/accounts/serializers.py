from rest_framework import serializers
from .models import User,UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'phone', 'location', 'role', 'education_level']
        extra_kwargs = {'password': {'write_only': True}}

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'location', 'role', 'education_level', 'is_active', 'date_registered']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'phone', 'location', 'role', 'education_level'
        ]
        read_only_fields = ['id', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'skills', 'interests',
            'profile_picture_url', 'resume_url',
            'rating', 'sessions_completed', 'years_experience'
        ]


class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='profile', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'phone', 'location', 'role',
            'education_level', 'date_registered', 'profile'
        ]




from rest_framework import serializers
from .models import User, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'skills', 'interests', 'profile_picture_url',
                  'rating', 'sessions_completed', 'years_experience']

class MentorSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    title = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    sessions = serializers.SerializerMethodField()
    expertise = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    availability = serializers.ListField(child=serializers.CharField(), default=[])

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'phone', 'location', 'role', 'education_level',
            'profile',
            'title', 'experience', 'avatar', 'sessions', 'expertise', 'price', 'availability'
        ]

    def get_title(self, obj):
        return f"{obj.role.replace('_', ' ').title()} in {obj.education_level.title()}"

    def get_experience(self, obj):
        if hasattr(obj, 'profile') and obj.profile.years_experience is not None:
            return f"{obj.profile.years_experience} years"
        return "N/A"

    def get_avatar(self, obj):
        if hasattr(obj, 'profile') and obj.profile.profile_picture_url:
            return obj.profile.profile_picture_url
        return "/placeholder.svg"

    def get_sessions(self, obj):
        if hasattr(obj, 'profile') and obj.profile.sessions_completed is not None:
            return obj.profile.sessions_completed
        return 0

    def get_expertise(self, obj):
        if hasattr(obj, 'profile') and obj.profile.skills:
            return [skill.strip() for skill in obj.profile.skills.split(',') if skill.strip()]
        return []
from rest_framework import serializers
from .models import Booking

from rest_framework import serializers

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['mentor', 'day', 'time', 'title', 'note']

    def create(self, validated_data):
        user = self.context['request'].user  # logged-in user
        return Booking.objects.create(mentee=user, **validated_data)
    
class BookingSerializer(serializers.ModelSerializer):
    mentor = serializers.StringRelatedField()
    mentee = serializers.StringRelatedField()

    class Meta:
        model = Booking
        fields = ['id', 'mentor', 'mentee', 'day', 'time', 'title', 'note']