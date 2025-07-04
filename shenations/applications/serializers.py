from rest_framework import serializers
from .models import Opportunity, Application

class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']
        

class ApplicationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['user', 'date_applied', 'updated_at', 'full_name', 'email']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['full_name'] = user.get_full_name() or user.username
        validated_data['email'] = user.email
        return super().create(validated_data)