from django.db import models

# Create your models here.



class SpaceMember(models.Model):
    name = models.CharField(max_length=200)
    uid = models.CharField(max_length=200)
    space_name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}"


