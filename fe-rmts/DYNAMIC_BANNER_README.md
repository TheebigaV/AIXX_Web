# Dynamic Home Banner System

This system allows administrators to dynamically update the home page banner content through the admin panel, with changes reflecting immediately on the public website.

## 🚀 Features

- **Dynamic Content**: Update banner titles, subtitle, and image without code changes
- **Real-time Updates**: Changes appear immediately on the public website
- **Image Management**: Upload and manage banner images with automatic fallbacks
- **Admin Panel**: User-friendly interface for content management
- **Responsive Design**: Banner adapts to all screen sizes
- **Error Handling**: Graceful fallbacks when content is unavailable

## 🏗️ Architecture

### Backend (Laravel)
- **Model**: `Banner` - Stores banner content and image paths
- **Controller**: `BannerController` - Handles API requests
- **Service**: `BannerService` - Business logic and file handling
- **API Endpoints**:
  - `GET /api/banners/latest` - Public endpoint (no auth required)
  - `GET /api/admin/banners/all` - Admin endpoint (auth required)
  - `POST /api/admin/banners` - Create new banner (auth required)
  - `POST /api/admin/banners/{id}?_method=PUT` - Update banner (auth required)

### Frontend (Next.js)
- **Admin Component**: `HomeBannerContent` - Content management interface
- **Public Component**: `HomeBanner` - Displays banner on home page
- **API Client**: `bannerApi.ts` - Handles API communication

## 📋 Database Schema

```sql
CREATE TABLE banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title1 VARCHAR(255) NULL,
    title2 VARCHAR(255) NULL,
    subtitle VARCHAR(500) NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
```

## 🎯 How It Works

### 1. Content Management
1. Admin navigates to the banner content management page
2. Updates titles, subtitle, and/or uploads new image
3. Saves changes using the form
4. Content is stored in the database

### 2. Public Display
1. Public home page loads
2. `HomeBanner` component fetches latest banner data from `/api/banners/latest`
3. Banner content is dynamically rendered
4. If no banner exists, fallback content is displayed

### 3. Real-time Updates
- Changes made in admin panel are immediately available on public site
- No page refresh required on public site
- Image updates are handled automatically

## 🛠️ Setup Instructions

### Backend Setup

1. **Run Migrations**
   ```bash
   php artisan migrate
   ```

2. **Verify Routes**
   ```bash
   php artisan route:list --path=api/banners
   ```

3. **Test API Endpoints**
   ```bash
   php test_banner_api.php
   ```

### Frontend Setup

1. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📱 Usage

### For Administrators

1. **Access Admin Panel**
   - Navigate to the banner content management page
   - Authenticate with admin credentials

2. **Update Content**
   - **Title 1**: Main heading (e.g., "Powering the North")
   - **Title 2**: Secondary heading in orange (e.g., "Over 20 Years")
   - **Subtitle**: Description text
   - **Image**: Upload new banner image (optional)

3. **Save Changes**
   - Click "Update Banner" to save changes
   - Changes appear immediately on public website

### For Developers

1. **Customize Banner Component**
   ```tsx
   // Modify HomeBanner.tsx for custom styling
   // Update fallback content in component
   ```

2. **Extend API Endpoints**
   ```php
   // Add new fields in Banner model
   // Update migration and validation rules
   ```

3. **Add New Features**
   - Multiple banner support
   - Scheduled content changes
   - A/B testing capabilities

## 🔧 Configuration

### Image Settings
- **Storage**: Images stored in `storage/app/public/banners/`
- **Max Size**: 2MB per image
- **Formats**: JPG, PNG, GIF, WebP
- **Recommended Dimensions**: 1920x1080px (16:9 aspect ratio)

### Validation Rules
- **Title 1**: Optional, max 255 characters
- **Title 2**: Optional, max 255 characters
- **Subtitle**: Optional, max 500 characters
- **Image**: Optional, max 2MB, image files only

## 🚨 Troubleshooting

### Common Issues

1. **Banner Not Updating**
   - Check if admin changes were saved successfully
   - Verify API endpoint is accessible
   - Check browser console for errors

2. **Image Not Displaying**
   - Verify image was uploaded successfully
   - Check storage permissions
   - Ensure storage link is created: `php artisan storage:link`

3. **API Errors**
   - Check Laravel logs: `storage/logs/laravel.log`
   - Verify database connection
   - Check route permissions

### Debug Commands

```bash
# Check banner data
php artisan tinker
>>> App\Models\Banner::all();

# Test API endpoint
curl http://localhost:8000/api/banners/latest

# Check storage
php artisan storage:link
ls -la public/storage
```

## 🔒 Security

- **Public Endpoint**: No authentication required for `/api/banners/latest`
- **Admin Endpoints**: Protected by Sanctum authentication
- **File Uploads**: Validated file types and sizes
- **Input Sanitization**: All user inputs are validated and sanitized

## 📈 Performance

- **Caching**: Consider implementing Redis caching for banner data
- **Image Optimization**: Use WebP format for better compression
- **Lazy Loading**: Images load with priority for banner visibility
- **CDN**: Consider using CDN for image delivery

## 🔄 Future Enhancements

- [ ] Multiple banner support (carousel)
- [ ] Scheduled content publishing
- [ ] A/B testing for banner content
- [ ] Analytics tracking
- [ ] Mobile-specific banner images
- [ ] Localization support

## 📞 Support

For technical support or feature requests:
- Check the troubleshooting section above
- Review Laravel and Next.js documentation
- Contact the development team

---

**Last Updated**: August 2025
**Version**: 1.0.0 