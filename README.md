# nodejs_ecommerce
# Section 3:
# sử dụng poolsize để maintain kết nối có sẵn và duy trì kết nối, maxpoolsize mặc định là 100 connections
# Section 9:
Trong đoạn mã này, filter là một đối tượng được sử dụng trong phương thức findOneAndUpdate của Mongoose để tìm và cập nhật một bản ghi trong cơ sở dữ liệu. Đây là chi tiết về các trường trong filter:

user: userId: Điều kiện lọc để tìm bản ghi dựa trên userId. Nó chỉ định rằng chúng ta muốn cập nhật bản ghi nào có trường user trùng với userId được cung cấp.
update: Đối tượng này chứa các trường dữ liệu cần cập nhật. Trong trường hợp này, nó bao gồm:
publicKey: Khóa công khai mới cần cập nhật.
privateKey: Khóa riêng tư mới cần cập nhật.
refreshTokenUsed: Một mảng mới, ban đầu được thiết lập là rỗng, để theo dõi các refreshToken đã sử dụng.
refreshToken: Token mới cần được cập nhật.
options: Đối tượng này chứa các tuỳ chọn cho việc cập nhật:
upsert: Nếu thiết lập là true, nếu không tìm thấy bản ghi phù hợp, Mongoose sẽ tạo một bản ghi mới.
new: Khi thiết lập là true, trả về bản ghi sau khi đã được cập nhật.
Trong đoạn mã đầy đủ, phương thức createKeyToken trong lớp KeyTokenService sử dụng filter này để tìm và cập nhật bản ghi trong cơ sở dữ liệu. Nếu thành công, nó trả về publicKey của token được cập nhật. Trong trường hợp xảy ra lỗi, nó in lỗi ra console và trả về lỗi đó.